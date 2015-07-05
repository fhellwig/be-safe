FROM buchananedwards/be-safe

EXPOSE 3000

# startup
ADD start.sh /besafe/
RUN ls -al /besafe
RUN chmod +x /besafe/start.sh  
CMD ./besafe/start.sh  