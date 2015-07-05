FROM buchananedwards/be-safe-base

EXPOSE 3000

# startup
ADD start.sh /tmp/
RUN chmod +x /tmp/start.sh  
CMD ./tmp/start.sh