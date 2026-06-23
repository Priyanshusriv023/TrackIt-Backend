const asynchandler = (funct) => {
         return (req,res,next)=>{
               Promise.resolve(funct(req,res,next))
               .catch((err)=>{
                    next(err);
               })
         }
}

export {asynchandler}
