'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = parser;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bemNaming = require('bem-naming');

var _bemNaming2 = _interopRequireDefault(_bemNaming);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parser(entityDeps) {
    var result = {
        entity: entityDeps.entity,
        dependOn: []
    };

    function normalize(deps) {
        if (typeof deps === 'string') {
            deps = { block: deps };
        }

        if (!Array.isArray(deps)) {
            deps = [deps];
        }

        return deps;
    }

    function add(mustOrShouldDeps, isMust) {
        if (!mustOrShouldDeps) return;

        normalize(mustOrShouldDeps).forEach(function (dep) {
            var dependOnEntity = {
                block: dep.block
            };

            ['elem', 'modName', 'modVal'].forEach(function (field) {
                dep[field] && (dependOnEntity[field] = dep[field]);
            });

            var dependency = {
                entity: dependOnEntity,
                tech: dep.tech
            };

            isMust && (dependency.order = 'dependenceBeforeDependants');

            _lodash2.default.some(result.dependOn, dependency) || result.dependOn.push(dependency);
        });
    }

    function remove(noDeps) {
        noDeps.forEach(function (noDep) {
            result.dependOn.forEach(function (dep, idx) {
                if (_bemNaming2.default.stringify(dep.entity) + dep.tech === _bemNaming2.default.stringify(noDep) + noDep.tech) {
                    result.dependOn.splice(idx, 1);
                }
            });
        });
    }

    // `entityDeps.deps` is an array of all entity dependencies from all files
    entityDeps.deps.forEach(function (entityOneFileDeps) {
        entityOneFileDeps.forEach(function (oneTechDeps) {
            oneTechDeps.tech && (result.tech = oneTechDeps.tech);

            add(oneTechDeps.mustDeps, true);
            add(oneTechDeps.shouldDeps);
            remove(oneTechDeps.noDeps);
        });
    });

    return result;
};