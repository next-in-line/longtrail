const url  = require('url');
const stackTrace = require('stack-trace')

const getLineandNumber = (_cwd, frame)=>{
    let cwd = process.cwd();
    cwd = cwd.replace(_cwd || '', '')
    
    return `${frame.getFileName().replace(cwd + "/", '')}:${frame.getLineNumber()}`
}

module.exports = {
    createControllerBase: (base)=>{
        class Controller{
            constructor(...attrs){
                const [req, res, params, action] = attrs;
        
                this.req = req;
                this.res = res;
                this.params = params || {};
                this.action = action;
                this.headers = this.req.headers
                this.url = url.parse(req.url, true);
                this.params = {
                    ...this.params,
                    ...(req.body || {}),
                    ...this.url.query
                }
            }
            before(){
                return true    
            }
            render(response, options = {}){
                if(typeof response !== 'string'){
                    options = response;
                }
        
                if(options.status) this.res.statusCode = options.status;
               
                if(options.json){
                    response = JSON.stringify(options.json);
                    this.res.setHeader('Content-Type', 'application/json');
                } 
                
                if(options.contentType){
                    this.res.setHeader('Content-Type', options.contentType);
                }
        
                if(options.nothing){
                    response = ''
                } else if(options.body){
                    response = options.body;
                } 
                
                if(!options.nothing && typeof response !== 'string'){
                    throw new Error('response must be string')
                }
        
                const frame = stackTrace.get()[1];
            
        
                console.log('Render: ', getLineandNumber(base.config.cwd, frame));
                console.log('----------------------------------');
        
                if(options.nothing){
                    console.log('ending')
                    return this.res.end()
                }else{
                    console.log('ending')
                    return this.res.end(response)
                }
            }
        
            index(){
                console.log('Index action needs to be filled out', this.constructor.name);
            }
            
            show(){
                console.log('Show action needs to be filled out', this.constructor.name);
            }
            
            create(){
                console.log('Create action needs to be filled out', this.constructor.name);
            }
            
            update(){
                console.log('Update action needs to be filled out', this.constructor.name);
            }
            
            destroy(){
                console.log('Destroy action needs to be filled out', this.constructor.name);
            }
        }

        return Controller
    }
}