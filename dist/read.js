'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = read;

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _bemNaming = require('bem-naming');

var _bemNaming2 = _interopRequireDefault(_bemNaming);

var _bemWalk = require('bem-walk');

var _bemWalk2 = _interopRequireDefault(_bemWalk);

var _reader = require('./formats/deps.js/reader');

var _reader2 = _interopRequireDefault(_reader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// returns `output` stream which will flush each entity data (totalEntityFiles === 0)
// and ends when no more deps left (totalDepsFiles === 0)
function read(config) {
    var reader = arguments.length <= 1 || arguments[1] === undefined ? _reader2.default : arguments[1];

    var output = new _stream2.default.Readable({ objectMode: true }),
        deps = {},
        isInited = false,
        totalDepsFiles = 0,
        walker = (0, _bemWalk2.default)(config.levels, { defaults: config.options });

    walker.on('data', function (file) {
        if (file.tech !== 'deps.js') return;

        isInited = true;
        totalDepsFiles++;

        var name = _bemNaming2.default.stringify(file.entity);

        deps[name] ? deps[name].files.push(file) : deps[name] = {
            files: [file],
            techs: {}
        };
    });

    walker.on('end', function () {
        Object.keys(deps).forEach(function (name) {
            var files = deps[name].files,
                totalEntityFiles = files.length;

            files.forEach(function (file) {
                reader(file, function (err, depsFile) {
                    if (err) {
                        output.emit('error', err);
                        output.push(null);
                        return;
                    }

                    totalDepsFiles--;
                    totalEntityFiles--;

                    depsFile.forEach(function (oneTechDeps) {
                        var techs = deps[name].techs,
                            techName = oneTechDeps.tech || '';

                        techs[techName] || (techs[techName] = []);
                        techs[techName].push([oneTechDeps]);
                    });

                    if (!totalDepsFiles && !totalEntityFiles) {
                        Object.keys(deps).forEach(function (name) {
                            var techs = deps[name].techs;

                            Object.keys(techs).forEach(function (techName) {
                                techs[techName].forEach(function (depsByTech) {
                                    depsByTech.forEach(function (dep) {
                                        var entity = {
                                            block: dep.block
                                        };

                                        dep.elem && (entity.elem = dep.elem);
                                        dep.modName && (entity.modName = dep.modName);
                                        dep.modVal && (entity.modVal = dep.modVal);

                                        output.push({
                                            entity: entity,
                                            tech: techName,
                                            deps: techs[techName]
                                        });
                                    });
                                });
                            });
                        });

                        output.push(null);
                    }
                });
            });
        });
    });

    output._read = function () {};

    return output;
};