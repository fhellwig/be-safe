var config = {
    log: {
        level: 'debug'
    },
    server: {
        host: 'http://localhost',
        port: 3000,
    },
    emails : {
        from_addr : "be-safe@buchanan-edwards.com",
        subscribe : {
            html: "<p>Dear Valued Consumer,<br/><br/>You have been subscribed to a [[subscribe type]] Alert for [[brand name]]. This means you will get regular updates about [[brand name]] [[subscribe type]]. You should get your first summary shortly.<br/></p>",
            text: "Dear Valued Consumer,\n\nYou have been subscribed to a [[subscribe type]] Alert for [[brand name]]. This means you will get regular updates about [[brand name]] [[subscribe type]]. You should get your first summary shortly.\n\n"
        },
        example: {
            salutation: {
                html: "<p>Dear Valued Consumer,<br/><br/>Here is your BE Safe email of the day:<br/></p>",
                text: "Dear Valued Consumer,\n\nHere is your BE Safe email of the day:\n\n"
            },
            recalls : {
                brand: {
                    html: "<b>Recall: [[brand name]]</b><br/>",
                    text: "Recall: [[brand name]]\n"
                },
                row : {
                    html: "<p>[[recall reason]]</p>",
                    text: "[[recall reason]]\n"
                }       
            },
            events : {
                brand: {
                    html: "<b>Adverse Reaction: [[brand name]]</b><br/>",
                    text: "Adverse Reaction: [[brand name]]\n"
                },
                row : {
                    //On 6/20/15, a 43 year-old male was found dead after taking aspirin.
                    html: "<p>On [[formatted date]] a [[patient age]] [[patient gender]] was [[event description]].</p>",
                    text: "On [[formatted date]] a [[patient age]] [[patient gender]] was [[event description]].\n"
                }       
            }
        },
        footer : {
            text : "You are getting this email because you subscribed to an alert on the BE Safe system. Put [[unsublink]] into your address bar to unsubscribe from this alert.",
            html : '<p><br/></p><p><i>You are getting this email because you subscribed to an alert on the BE Safe system. Click <a href="[[unsublink]]">here</a> to unsubscribe from this alert.</p>'
        }
    }
};

module.exports = config;
