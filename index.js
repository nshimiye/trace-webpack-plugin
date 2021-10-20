class Trace {
    pluginName = 'trace'
    constructor(options) {this.options = options; }
    apply(compiler) {

        // fileName refers to the name (or partial name) of an imported module
        // ex: fileName = 'Controller' or './Controller';
        const { fileName, pattern } = this.options;
        
        
        compiler.hooks.thisCompilation.tap(this.pluginName, (compilation, compilationParams) => {
            compilation.hooks.finishModules.tapAsync(this.pluginName, (modules, callback) => {
                const dtree = modules.map(m=> ({ name:m.name||m.rawRequest, dep: Array.from(new Set(m.dependencies.map(m => m.module?m.module.rawRequest:'').filter(Boolean)))}));
                // console.log('[modules]', Math.random(), dtree.length);
                let regexp = new RegExp(fileName||pattern);

                // const parentModules = dtree.filter(pm=>pm.dep.some(m => m.includ9es(fileName)) );
                const parentModules = dtree.filter(pm=>pm.dep.some(m => regexp.test(m)) );
                if(!parentModules.length){
                    callback();
                    return;
                }

                const startModuleFull = parentModules[0].dep.find( m => regexp.test(m) );
                const tracingPath = getTracingPath(startModuleFull, dtree);
                console.log('[TRACE]', tracingPath.join(' -> '));
                
                process.exit();
                callback();
            });
        });
    }
}

/**
 * 
 * @param {*} depModule 
 * @param {*} depTree 
 * @returns {Array<module>}
 */
 function getTracingPath(depModule, depTree) {

    const parentModules = depTree.filter(pm=>pm.dep.includes(depModule) ).map(pm => pm.name);


    // base: depModule is an entry module OR
    // base: depModule does NOT have parentModule
    if(!parentModules.length) {
        return [depModule];
    }

    // recursive
    const parentModule = parentModules[0]; // pickOneParent
    return  [...getTracingPath(parentModule, depTree), depModule];
}


module.exports.Trace = Trace;