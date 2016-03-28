import { expect } from 'chai';
import { findIndex } from '../../utils';
import { findLastIndex } from '../../utils';
import { resolve } from '../../../lib';

describe('resolving ordered deps: common for specific tech', function () {
    it('should resolve entity depending on another entity', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'B' });
    });

    it('should resolve entity depending on multiple ordered entities', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            order: 'dependenceBeforeDependants'
                        },
                        {
                            entity: { block: 'C' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'B' })
            .and.to.contain({ block: 'C' });
    });

    it('should resolve entity depending on ordered and unordered entities', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            order: 'dependenceBeforeDependants'
                        },
                        {
                            entity: { block: 'C' }
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'B' })
            .and.to.contain({ block: 'C' });
    });

    it('should include entity once if entity depends on itself', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'A' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts),
            firstIndex = findIndex(resolved.entities, { block: 'A' }),
            lastIndex = findLastIndex(resolved.entities, { block: 'A' });

        expect(firstIndex).to.not.be.equal(-1);
        expect(lastIndex).to.not.be.equal(-1);
        expect(firstIndex).to.be.equal(lastIndex);
    });

    it('should resolve dependency depending on another entity', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'C' });
    });

    it('should allow dependency to depend on another multiple entities', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            order: 'dependenceBeforeDependants'
                        },
                        {
                            entity: { block: 'D' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.contain({ block: 'C' })
            .and.to.contain({ block: 'D' });
    });

    it('should include entity once if multiple entities depend on this entity', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts),
            firstIndex = findIndex(resolved.entities, { block: 'C' }),
            lastIndex = findLastIndex(resolved.entities, { block: 'C' });

        expect(resolved.entities).to.contain({ block: 'C' });
        expect(firstIndex).to.be.equal(lastIndex);
    });

    it('should not include entity if no entity from decl depends on it and this entity has dependency on entity' +
        ' listed in decl', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'A' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).not.to.contain({ block: 'B' });
    });

    it('should not include dependency of dependency if no entity from decl\'s dependencies depends ' +
        'on it', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'C' },
                    dependOn: [
                        {
                            entity: { block: 'D' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.entities).to.not.contain({ block: 'D' });
    });
});