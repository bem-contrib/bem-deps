'use strict';

const test = require('ava');
const sinon = require('sinon');

const BemEntityName = require('bem-entity-name');

const Vertex = require('../../../lib/graph/vertex');
const MixedGraph = require('../../../lib/graph/mixed-graph');
const DirectedGraph = require('../../../lib/graph/directed-graph');

const vertex1 = new Vertex(new BemEntityName({ block: 'button' }), 'css');
const vertex2 = new Vertex(new BemEntityName({ block: 'control' }), 'css');

test.beforeEach(t => {
    const mixedGraph = new MixedGraph();
    const getSubgraphStub = sinon.stub(mixedGraph, '_getSubgraph');
    const addVertexSpy = sinon.spy(mixedGraph, 'addVertex');

    t.context.mixedGraph = mixedGraph;
    t.context.getSubgraphStub = getSubgraphStub;
    t.context.addVertexSpy = addVertexSpy;
});

test.afterEach(t => {
    t.context.getSubgraphStub.restore();
});

test('should be chainable', t => {
    const graph = t.context.mixedGraph;

    t.is(graph.addEdge(vertex1, vertex2), graph);
});

test('should add vertices', t => {
    t.context.mixedGraph.addEdge(vertex1, vertex2);

    t.true(t.context.addVertexSpy.calledWith(vertex1));
    t.true(t.context.addVertexSpy.calledWith(vertex2));
});

test('should add edge to subgraph', t => {
    const directedGraph = new DirectedGraph();
    const addEdgeSpy = sinon.spy(directedGraph, 'addEdge');

    t.context.getSubgraphStub.returns(directedGraph);

    t.context.mixedGraph.addEdge(vertex1, vertex2);

    t.true(addEdgeSpy.calledWith(vertex1, vertex2));
});

test('should add subgraph to unordered map', t => {
    t.context.getSubgraphStub.returns(undefined);

    const mixedGraph = t.context.mixedGraph;

    mixedGraph.addEdge(vertex1, vertex2, { ordered: false });

    const subgraph = mixedGraph._unorderedGraphMap.get('css');

    t.true(subgraph instanceof DirectedGraph);
});

test('should add subgraph to ordered map', t => {
    t.context.getSubgraphStub.returns(undefined);

    const mixedGraph = t.context.mixedGraph;

    mixedGraph.addEdge(vertex1, vertex2, { ordered: true });

    const subgraph = mixedGraph._orderedGraphMap.get('css');

    t.true(subgraph instanceof DirectedGraph);
});

test('should add edge to created subgraph', t => {
    t.context.getSubgraphStub.returns(undefined);

    const mixedGraph = t.context.mixedGraph;

    mixedGraph.addEdge(vertex1, vertex2, { ordered: false, tech: 'css' });

    const subgraph = mixedGraph._unorderedGraphMap.get('css');

    t.true(subgraph.hasVertex(vertex1));
    t.true(subgraph.hasVertex(vertex2));
});
