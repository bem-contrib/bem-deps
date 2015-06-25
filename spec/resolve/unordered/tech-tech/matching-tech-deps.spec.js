var expect  = require('chai').expect,
    _       = require('lodash'),
    resolve = require('../../../../lib/index').resolve;

describe('resolving unordered dependencies: tech - tech for matching tech', function () {
    it('should resolve tech depending on another tech', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [{
                        entity: { block: 'B' },
                        tech: 'css'
                    }]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'B' });
    });

    it('should resolve tech depending on multiple techs', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        },
                        {
                            entity: { block: 'B' },
                            tech: 'js'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'B' });
    });

    it('should resolve multiple tech in entity depending on another tech', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'A' },
                    tech: 'js',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'B' });
    });

    it('should resolve multiple tech in entity depending on multiple techs in another entity and one of this techs ' +
        'matching with resolving tech', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'A' },
                    tech: 'js',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'js'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'B' });
    });

    it('should resolve tech in multiple entities depending on same with resolving tech in another ' +
        'entity', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [{
                        entity: { block: 'C' },
                        tech: 'css'
                    }]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [{
                        entity: { block: 'C' },
                        tech: 'css'
                    }]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'C' });
    });

    it('should resolve tech in multiple entities depending on multiple techs of entity and 1 of this techs same ' +
        'with resolving', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [{
                        entity: { block: 'C' },
                        tech: 'js'
                    }]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [{
                        entity: { block: 'C' },
                        tech: 'css'
                    }]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'C' });
    });

    it('should resolve tech dependency depending on tech same with resolving in another entity', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'css'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'C' });
    });

    it('should resolve tech dependency depending on techs same with resolving tech', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'css'
                        },
                        {
                            entity: { block: 'D' },
                            tech: 'css'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'C' })
            .and.to.contain({ block: 'D' });
    });

    it('should resolve multiple tech dependencies depending on another tech same with resolving tech', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        },
                        {
                            entity: { block: 'C' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [{
                        entity: { block: 'D' },
                        tech: 'css'
                    }]
                },
                {
                    entity: { block: 'C' },
                    dependOn: [{
                        entity: { block: 'D' },
                        tech: 'css'
                    }]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'D' });
    });

    it('should include tech to result once if tech of multiple entities depend on this tech and this tech matches' +
        ' with resolving tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'css'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts),
            firstIndex = _.findIndex(resolved.entities, { block: 'C' }),
            lastIndex = _.findLastIndex(resolved.entities, { block: 'C' });

        expect(resolved).to.contain({ block: 'C' });
        expect(firstIndex).to.be.equal(lastIndex);
    });

    it('should not include tech dependency if no entity from decl depends on it and this entity has tech' +
        'dependency on entity listed in decl', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'A' },
                            tech: 'css'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).not.to.contain({ block: 'B' });
    });

    it('should not include tech dependencie\'s dependency if no entity from decl\'s dependencies depends ' +
        'on it', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'C' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'D' },
                            tech: 'css'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.not.contain({ block: 'D' });
    });
});