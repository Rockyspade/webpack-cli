const { readdirSync } = require('fs');
const { join, resolve, extname } = require('path');

class webpackCLI {
    constructor() {
        this.groupMap = new Map();
        this.groups = [];
        this.processingErrors = [];
    }
     setMappedGroups(args, yargsOptions) {
        const {argv} = args; 
        Object.keys(argv).map( key => {
            this.setGroupMap(key, argv[key], yargsOptions);
        });
    }
    setGroupMap(key, val, yargsOptions) {
        Object.keys(yargsOptions).filter(opt => opt === key).forEach(opt => {
            const groupName = yargsOptions[opt].group;
            let namePrefix;
            if(groupName.length) {
                namePrefix = groupName.slice(0, groupName.length - 9);
                const hasActiveConjgection = namePrefix.slice(namePrefix.length - 3);
                if(hasActiveConjgection === "ing") {
                    namePrefix = (namePrefix.slice(0, namePrefix.length - 3) + "e");
                }
            } else {
                // handle generally
            }

            namePrefix = namePrefix.toLowerCase();
            // push to existing map if a group is present
            if(this.groupMap.has(namePrefix)) {
                const pushToMap = this.groupMap.get(namePrefix);
                pushToMap.push({[opt]: val})
            } else {
                this.groupMap.set(namePrefix, [{[opt]: val}]);
            }
        })
    }
    formatDashedArgs() {
    }

    resolveGroups() {
        for (const [key, value] of this.groupMap.entries()) {
            const fileName = join(__dirname, 'groups', key);
            const file = resolve(fileName);
            this.groups.push({[file]: value})
        }
    }

    

    async run(args, yargsOptions) {
        await this.setMappedGroups(args, yargsOptions);
        await this.resolveGroups();
        return {
            webpackOptions: {},
            processingErrors: []
        }
    }
}


module.exports = webpackCLI