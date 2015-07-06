# BE Safe

BE Safe is a prototype application developed by [Buchanan & Edwards](http://www.buchanan-edwards.com) in response to RFQ 4QTFHS150004 issued by the General Services Administration (GSA).

BE Safe is an AngularJS web app running on a Node.js/Express API and is deployable accross a wide variety of platforms. It accesses the OpenFDA API and allows users to search for drug recalls and adverse reactions. Users can subscribe to alerts and receive notifications of new recalls and reactions based on their search criteria. In addition to notifications, users can share their results on social media and also submit their own individual adverse reactions.

## 1. Operational Prototype 

The BE Safe prototype can be run on a desktop or mobile browser from the following URL:

- [https://be-safe.buchanan-edwards.com](https://be-safe.buchanan-edwards.com)

This URL is an alias to the actual deployed application running on Amazon Web Services (AWS) Elastic Beanstalk at 
[http://be-safe.elasticbeanstalk.com](http://be-safe.elasticbeanstalk.com). The difference between these URLs is that the primary URL has an SSL certificate that is bound to the buchanan-edwards.com domain.

### 1.1 Prototype Installation

The BE Safe application can be run on any platform supporting Node.js. Here is the installation procedure:

```
$ git clone repo

[TBD - local.js configuration]

$ npm install
$ npm start
```

## 2. Solution Approach

Our solution approach was based on the following four fundamental principles:

1. **Team** - Leverage a multi-disciplined team that is not only technically innovative, but has process experience ranging from agile methodologies to user acceptance testing.

2. **Architecture** - Implement a modern UI/API architecture with a Single Page Application (SPA) connected to an independently-testable Application Programming Interface (API).

3. **Users** - Adopt a mobile-first approach by acknowledging the trend that mobile devices are used in ever-increasing numbers for web access.

4. **Operations** - Make continuous build, test, and deployment an integral part of the project workflow and couple the results directly into our product backlog.

We will now discuss each of these principles and reference the required points outlined in the RFQ.

### 2.1 The Team

Our team was led by Brian Shafer who was responsible for the overall operation of the prototype team as defined in our project charter. The team included the following GSA 18F Labor Categories.

- Product Manager  
- Technical Architect  
- Interaction Designer / User Researcher / Usability Tester  
- Visual Designer  
- Frontend Web Developer  
- Backend Web Developer  
- DevOps Engineer  
- Security Engineer  
- Delivery Manager  
- Business Analyst

We wanted to ensure that we not only had a team that could provide technical competence, but also one that delivered *process* in addition to *product*.

The full labor categories and their mapping to our GSA Schedule 70 is fully documented in the evidence portion of this RFQ response.

As part of our overall methodology, we incorporated the following five 18F guiding principles into the team's collective vision. They are repeated here with a small note on how we approached each of these principles.

1. **Put the needs of users first** - In parallel with development and deployment, we had multiple team members running the application. They determined where there were usability issues and any scaling issues on mobile devices.

2. **Release early, iteratively, and often** - We continuously auto-deployed from our Git development branch so any deployment issues would be known immediately. This gave our sample users a frequently-refreshed build that they could evaluate on a continuous basis.

3. **Don’t slow down delivery** - Instead of developing the API first and then the user interface, we worked in parallel, taking a wholistic approach so that a working application could be delivered and tested sooner rather than later.

4. **Only do it if it adds value** - We balanced adding new features against the potential for feature bloat and possible user confusion. In the end, reliability and efficiency outweighed features and flash.

5. **Work in the open** - During the RFQ response phase, our GitHub repository was private, but we leveraged only open source code and incorporated open source projects produced by Buchanan & Edwards and available on GitHub into the BE Safe application.

We also interpret that last point, *work in the open*, on a more personal level. During the course of developing this prototype, none of our team members worked in cubicles. Just as deploying early and often was critical, so too was an open atmosphere of team members collaborating in a single room, sharing ideas and working towards a common goal. We employed pair-programming so that no one person was stuck and was always collaborating with another developer at their side.

### 2.2 The Architecture

We took a modern, best practice architecture view for this prototype. BE Safe is an AngularJS web app that is served by a Node.js server application. This same server application provides the API consumed by the AngularJS web app. We took this approach because it allowed our API to be tested in isolation from the user interface and is a clean way of separating the user experience from the business logic and database access.

#### 2.2.1 Open Source Technologies

An examination of both our `package.json` and `bower.json` files will reveal all of the technologies used in the BE Safe application. Here are the top technologies that made a difference for us:

1. **Node.js** - A cross-platform server-side technology that allows us to develop, test, and deploy on Windows, Mac, and Linux systems.
 
2. **Express** - A web framework for Node that provides both our web application as well as our backend API.
 
3. **AngularJS** - A model-view-model framework for creating routable and extensible web applications.
 
4. **Bootstrap** - A CSS framework that provides cross-browser compatible styling and components for a robust user interface.
 
5. **SQLite** - An embedded database that we use for storing subscriptions as well as adverse reaction reports.
 
6. **Bunyan** - A logging facility for Node that is customizable for both development and production.
 
7. **Morgan** - An Express logging facility for tracking all HTTP requests, responses, and errors.
 
8. **Circle CI** - A continuous integration tool that pulls from GitHub, runs tests, and auto-deploys to AWS.
 
9. **Docker** - A container-as-a-service platform for packaging our application in addition to AWS deployment.

However, a good architecture is meaningless if is does not also fulfill user's expectations and is deployable and testable in a variety of configurations. The next two sections discuss these important points.

### 2.3 Our Users

As mentioned previously, we took a mobile-first approach to our application. We used the Bootstrap CSS framework as it results is a cross-browser and cross-device application.

Our business analysts also ensured that we used user-centric approaches to our development. We included people in every aspect of our efforts including envisioning, design and development. We conducted usability testing with a group of employees that were not part of this proposal effort. All responses were captured and put into our Jira backlog. Most of the feedback concerned issues where application use was clear to the developers but proved less intuitive to an uninitiated user. This was an important part of our software life cycle.


### 2.4 Deployment and Operations

#### 2.4.1 Continuous Integration

We set up automatic deployment to both Microsoft Azure and AWS Elastic Beanstalk at the very beginning of the project. This multi-phase deployment not only ensured that we *could* deploy, but that we we could deploy to multiple environments and that nothing in our software was platform-specific.

For Azure, it was trivial to pull directly from GitHub. Azure proved to be a solid test asset as it was continuously updated on commits. For AWS, we used the Circle CI tool to run automated tests and then deploy to AWS Elastic Beanstalk running a Docker container on successful completion of those tests.

#### 2.4.1 Continuous Monitoring

We used AWS CloudWatch for continuous monitoring to ensure a baseline knowledge of our application's performance and to properly manage our security risks.  

#### 2.4.2 Docker Containers

We leveraged Docker to containerize our application as it integrated nicely with our source control, CI and deployment approaches. Docker is well recognized and supported and met our needs for configuration management, continuous integration and ease of deployment and distribution.  

## 3. Development Approach
BE used a modified version of its Agile Development process and tools to create GSA's requested prototype. Our Agile development approach was tailored to the size, scope and timelines of this effort specifically we condensed our use of Google’s Ventures Design Sprint (http://www.gv.com/sprint/) into less than 2 days and conducted daily sprints vs. 2 week sprints. 

The BE team was assembled in February and conducted practice sessions to ensure we were ready to work together as an integrated team. The team came back together upon the solicitations release and hit the ground running. We used less than 2 days to unpack, sketch and design. On the 2nd day we began daily sprints that included development, releases, demos, retrospectives and user story and backlog updates. At key points we incorporated user feedback including usability and acceptance testing.

## 4. Evidence Index
Criteria 1  
Criteria 2  
Criteria 3  
Criteria 4  
Criteria 5  
Criteria 6  
Criteria 7  
Criteria 8  
Criteria 9  
Criteria 10  
Criteria 11  
Criteria 12  
Criteria 13  
Criteria 14  
Criteria 15  
Criteria 16  
Criteria 17  
Criteria 18  
Criteria 19
