'use strict';

const test = require('ava');
const expect = require('chai').expect;

const BemGraph = graphLib.BemGraph;
const macro = graphUtils.depsMacro;

test('should include entity once if entity depends on a', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            [linkMethod]({ block: 'A' }, 'css');

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.be.eql([{ entity: { block: 'A' }, tech: 'css' }]);
    }
});
