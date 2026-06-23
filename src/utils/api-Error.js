class apiError extends Error{  //Class Error is built-in class
         constructor(
             statuscode,
             
             message = "something is wrong",
             errors = [],
             stack,

            
         ){

             
             super(message)
             this.statusCode = statuscode
             this.data = null
             this.message = message
             this.success = false
             this.errors = errors
         

         if(stack){
             this.stack = stack;
         }

         else{
                Error.captureStackTrace(this, this.constructor)
         }
         }

        }

        export {apiError}
             
           
        
         
             
         
