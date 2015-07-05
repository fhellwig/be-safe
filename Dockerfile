FROM buchananedwards/be-safe

EXPOSE 3000

# startup
ADD start.sh /besafe/scripts  
RUN chmod +x /besafe/scipts/start.sh  
CMD ./besafe/scripts/start.sh  