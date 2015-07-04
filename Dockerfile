#Set Container OS
FROM ubuntu:14.04

#Expose a port
EXPOSE 3000

#Prepare the environment
RUN sudo apt-get -y install curl
RUN curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN sudo apt-get -y install nodejs git python2.7 make g++

#Set up git
RUN git config --global user.email "be-safe@buchanan-edwards.com"
RUN git config --global user.name "BE Safe User"

#Clone the most current branch of the github repo
RUN git clone -b develop https://github.com/brandtheisey/be-safe.git besafe/

#Set up the application's node dependencies
RUN cd /besafe && npm install -g gulp
RUN cd /besafe && npm install
RUN cd /besafe && gulp app
CMD ["/bin/bash"]