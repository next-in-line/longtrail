const fs = require('fs');
const path = require('path');
const _ = require('lodash')
_.mixin(require("lodash-inflection"));

module.exports = (name, options)=>{
    let {folder, scoped} = options;

    const example = fs.readFileSync(path.join(__dirname, '/example.js'), 'utf8');
    let file = example.replace(/ExampleName/g, name);
    let singularName = _.singularize(name.replace('Controller', ''))
    file = file.replace(/ExampleModelName/g, 
        _.chain(singularName).camelCase().upperFirst().value()
    );

    if(folder){
        folder = `/${folder}/`
    }else{
        folder = `/`
    }
    folder = folder || ''

    if(scoped){
        file = file.replace('extends Controller', `extends Base`);
        file = file.replace(`const Controller = require('lib/controller')`, `const Base = require('./base')`);
    }

    file = file.replace(/exampleNameItem/g, 
        _.camelCase(
            singularName
        )
    );
    

    let fileName = path.join(__dirname, `../../src/controllers${folder}${name}.js`);

    if(!fs.existsSync(fileName)){
        fs.writeFileSync(fileName, file);
        console.log(`generated controller ${fileName}`)
    }else{
        console.log(`Cannot generate controller ${fileName} file already exists!`)
    }

}