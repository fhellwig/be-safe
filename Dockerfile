FROM buchananedwards/be-safe-base

EXPOSE 8081

# startup
ADD start.sh /tmp/
RUN chmod +x /tmp/start.sh  
CMD ./tmp/start.sh