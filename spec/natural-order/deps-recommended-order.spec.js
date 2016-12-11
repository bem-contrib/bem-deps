'use strict';

const test = require('ava');

const BemGraph = graphLib.BemGraph;
const findIndex = graphUtils.findIndex;

test('should place block before its element', t => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A', elem: 'e' },
        { block: 'A' }
    ];
    decl.forEach(e => graph.vertex(e));

    graph.naturalize();

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexBlock = findIndex(resolved, { entity: { block: 'A' } });
    const indexElem = findIndex(resolved, { entity: { block: 'A', elem: 'e' } });

    t.true(indexBlock < indexElem);
});

test('should place block before its boolean modifier', t => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A', modName: 'm', modVal: true },
        { block: 'A' }
    ];
    decl.forEach(e => graph.vertex(e));

    graph.naturalize();

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexBlock = findIndex(resolved, { entity: { block: 'A' } });
    const indexModifier = findIndex(resolved, { entity: { block: 'A', modName: 'm' } });

    t.true(indexBlock < indexModifier);
});

test('should place block before its key-value modifier', t => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A', modName: 'm', modVal: 'any' },
        { block: 'A' }
    ];
    decl.forEach(e => graph.vertex(e));

    graph.naturalize();

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexBlock = findIndex(resolved, { entity: { block: 'A' } });
    const indexModifier = findIndex(resolved, { entity: { block: 'A', modName: 'm', modVal: 'any' } });

    t.true(indexBlock < indexModifier);
});

test('should place block before its element with boolean modifier', t => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A', elem: 'e', modName: 'm', modVal: true },
        { block: 'A' }
    ];
    decl.forEach(e => graph.vertex(e));

    graph.naturalize();

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexBlock = findIndex(resolved, { entity: { block: 'A' } });
    const indexElem = findIndex(resolved, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: true } });

    t.true(indexBlock < indexElem);
});

test('should place block before its element with key-value modifier', t => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A', elem: 'e', modName: 'm', modVal: 'any' },
        { block: 'A' }
    ];
    decl.forEach(e => graph.vertex(e));

    graph.naturalize();

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexBlock = findIndex(resolved, { entity: { block: 'A' } });
    const indexElem = findIndex(resolved, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'any' } });

    t.true(indexBlock < indexElem);
});

test('should place block before its boolean modifier', t => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A', modName: 'm', modVal: true },
        { block: 'A' }
    ];
    decl.forEach(e => graph.vertex(e));

    graph.naturalize();

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexBlock = findIndex(resolved, { entity: { block: 'A' } });
    const indexBoolean = findIndex(resolved, { entity: { block: 'A', modName: 'm', modVal: true } });

    t.true(indexBlock < indexBoolean);
});

test('should place block\'s boolean modifier before block key-value modifier', t => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A', modName: 'm', modVal: 'any' },
        { block: 'A', modName: 'm', modVal: true }
    ];
    decl.forEach(e => graph.vertex(e));

    graph.naturalize();

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexBoolean = findIndex(resolved, { entity: { block: 'A', modName: 'n', modVal: true } });
    const indexKeyValue = findIndex(resolved, { entity: { block: 'A', modName: 'm', modVal: 'any' } });

    t.true(indexBoolean < indexKeyValue);
});

test('should place elem before its boolean modifier', t => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A', elem: 'e', modName: 'm', modVal: true },
        { block: 'A', elem: 'e' }
    ];
    decl.forEach(e => graph.vertex(e));

    graph.naturalize();

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexElem = findIndex(resolved, { entity: { block: 'A', elem: 'e' } });
    const indexModifier = findIndex(resolved, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: true } });

    t.true(indexElem < indexModifier);
});

test('should place elem before its key-value modifier', t => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A', elem: 'e', modName: 'm', modVal: 'any' },
        { block: 'A', elem: 'e' }
    ];
    decl.forEach(e => graph.vertex(e));

    graph.naturalize();

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexElem = findIndex(resolved, { entity: { block: 'A', elem: 'e' } });
    const indexModifier = findIndex(resolved, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'any' } });

    t.true(indexElem < indexModifier);
});

test('should place elem\'s boolean modifier before elem key-value modifier', t => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A', elem: 'e', modName: 'm', modVal: 'any' },
        { block: 'A', elem: 'e', modName: 'm', modVal: true }
    ];
    decl.forEach(e => graph.vertex(e));

    graph.naturalize();

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexBoolean = findIndex(resolved, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: true } });
    const indexKeyValue = findIndex(resolved, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'any' } });

    t.true(indexBoolean < indexKeyValue);
});
