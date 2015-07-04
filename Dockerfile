#Set Container OS
FROM buchananedwards/be-safe-base

#Expose a port
EXPOSE 3000

#Clone the most current branch of the github repo
RUN cd /besafe && git checkout develop

#Set up the application's node dependencies
RUN cd /besafe && gulp app
RUN cd /besafe && npm start &