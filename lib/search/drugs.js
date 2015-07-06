var helper = require('../fda-api-helper');

var VALID_SEARCH_TYPES = ['recalls', 'events'];

/*
 * Searches the recall or event endpoints given the following query parameters:
 *
 * skip         (number)    required
 * limit        (number)    required   
 * search_type  (string)    required ('recalls' | 'events')
 * brand_name   (string)    required
 * offset_days  (string)    optional
 * sex          ('m' | 'f') optional (both are assumed if not provided)
 * min_age      (number)    optional
 * max_age      (number)    required only if min_age is also specified
 *
 */
function search(query, callback) {
    var s = {}; // the search string provided to the endpoint
    var path;
    var processFn;

    var errors = validateQuery(query);

    if (errors) {
        return callback({
            status: 'fail',
            data: errors,
            code: 400,
            message: JSON.stringify(errors)
        });
    }

    query.skip = parseInt(query.skip);
    query.limit = parseInt(query.limit);

    if (query.search_type === 'recalls') {
        s['product_description'] = query.brand_name;
        if (typeof query.offset_days === 'string') {
            s['report_date'] = toDateRange(parseInt(query.offset_days));
        }
        path = '/drug/enforcement.json';
        processFn = processRecallResults;
    } else if (query.search_type === 'events') {
        s['patient.drug.openfda.brand_name'] = query.brand_name;
        if (typeof query.offset_days === 'string') {
            s['receivedate'] = toDateRange(parseInt(query.offset_days));
        }
        if (typeof query.sex === 'string') {
            s['patient.patientsex'] = query.sex === 'm' ? 1 : 2;
        }
        if (typeof query.min_age === 'string') {
            s['patient.patientonsetage'] = '[' + query.min_age + ' TO ' + query.max_age + ']';
        }
        path = '/drug/event.json';
        processFn = processEventResults;
    } else {
        throw new Error('Should not happen if we check against VALID_SEARCH_TYPES');
    }

    // Construct the search query parameter.
    var buf = [];
    Object.keys(s).forEach(function (key) {
        buf.push(key + ':' + s[key]);
    });
    var search = buf.join(' AND ').replace(/ /g, '+');
    // Get the data from the endpoint using the helper.
    helper.get(path, query.skip, query.limit, search, function (response) {
        if (response.status === 'success') {
            response.data.results = processFn(response.data.results);
        }
        callback(response);
    });
}

// Converts an array of raw results to an array of objects each having a
// timestamp, product, and reason property. Duplicate event ids are removed
// and the results are sorted by timestamp from newest to oldest recall.
function processRecallResults(results) {
    var retval = [];
    var eventIds = {}; // prevent duplicates
    results.forEach(function (r) {
        retval.push({
            timestamp: parseDateString(r.report_date),
            product: r.product_description,
            reason: r.reason_for_recall,
            duplicate: !!eventIds[r.event_id]
        });
        eventIds[r.event_id] = true; // we've now seen this one
    });
    // Sort from newest to oldest.
    retval.sort(function (a, b) {
        return b.timestamp - a.timestamp;
    });
    return retval;
}

function processEventResults(results) {
    var retval = [];
    results.forEach(function (r) {
        var age = r.patient.patientonsetage;
        if (typeof age === 'string') {
            age = parseInt(age);
        }
        if (typeof age === 'number') {
            age = Math.round(age);
        } else {
            age = null;
        }
        var sex = r.patient.patientsex;
        if (typeof sex === 'string') {
            sex = parseInt(sex);
        }
        if (typeof sex === 'number') {
            if (sex === 1) {
                sex = 'male';
            } else if (sex === 2) {
                sex = 'female';
            } else {
                sex = null;
            }
        } else {
            sex = null;
        }
        var drugs = [];
        if (r.patient && r.patient.drug) {
            r.patient.drug.forEach(function (drug) {
                if (drug.openfda && drug.openfda.substance_name) {
                    drug.openfda.substance_name.forEach(function (name) {
                        name = name.toLowerCase();
                        if (drugs.indexOf(name) < 0) {
                            drugs.push(name);
                        }
                    });
                }
            });
        }
        var issues = [];
        r.patient.reaction.forEach(function (issue) {
            issues.push(issue.reactionmeddrapt.toLowerCase());
        });
        retval.push({
            timestamp: parseDateString(r.receivedate),
            age: age,
            sex: sex,
            drugs: drugs,
            issues: issues
        });
    });
    // Sort from newest to oldest.
    retval.sort(function (a, b) {
        return b.timestamp - a.timestamp;
    });
    return retval;
}

// Validates the query. Returns null if valid. Otherwise, an object is
// returned with invalid query parameter names mapped to error messages.
function validateQuery(query) {
    var errors = {};

    if (isNaN(parseInt(query.skip))) {
        errors.skip = 'Required number parameter';
    }

    if (isNaN(parseInt(query.limit))) {
        errors.limit = 'Required number parameter';
    }

    if (typeof query.brand_name !== 'string') {
        errors.brand_name = 'Required string parameter';
    }

    if (typeof query.search_type !== 'string') {
        errors.search_type = 'Required string parameter';
    } else if (VALID_SEARCH_TYPES.indexOf(query.search_type) < 0) {
        errors.search_type = 'Must be one of ' + VALID_SEARCH_TYPES.join(' | ');
    }

    return Object.keys(errors).length > 0 ? errors : null;
}

// Parses a date string in the format "yyyymmdd" (no hyphens) and returns
// the millisecond time value.
function parseDateString(ds) {
    var year = parseInt(ds.substring(0, 4));
    var month = parseInt(ds.substring(4, 6));
    var day = parseInt(ds.substring(6, 8));
    var date = new Date(year, month - 1, day);
    return date.getTime();
}

// Returns a date range string in the format "yyyy-mm-dd+TO+yyyy-mm-dd" where
// the second date is the current date and the first date is the current date
// minus the specified number of days.
function toDateRange(days) {
    var max = new Date();
    var ms = max.getTime();
    var min = new Date(ms - (days * 86400000));
    return '[' + toDateString(min) + '+TO+' + toDateString(max) + ']';
}

// Converts a date object to an ISO 8601 "yyyy-mm-dd" string.
function toDateString(date) {
    var s = date.toISOString();
    var t = s.indexOf('T');
    return s.substring(0, t);
}

module.exports = {
    search: search
};
