"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Controls, ReactFlow, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Link from 'next/link';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import Drawer from '@/components/ui/drawer';

const initialNodes = [
  {
    id: '1',
    type: 'default',
    position: { x: 0, y: 0 },
    data: {
        label: 'What is a black hole?',
        description: 'A cosmic phenomenon where gravity becomes so strong that nothing, not even light, can escape',
        reasoning: 'Understanding black holes requires combining Einstein’s general relativity with quantum mechanics. They form when massive stars collapse under their own gravity, creating regions of spacetime where our known laws of physics reach their limits.',
        details: `
    A black hole is a region in space where:
    1. **Gravitational Singularity**: All mass is compressed into an infinitely dense point (though quantum physics suggests this may not be literal).
    2. **Event Horizon**: The boundary around the singularity where escape velocity exceeds light speed (Schwarzschild radius: rₛ = 2GM/c²).
    3. **Formation**: Created when massive stars (>20 solar masses) exhaust their nuclear fuel and collapse in a supernova.
    4. **Types**: 
    - Stellar-mass (3-100 solar masses)
    - Supermassive (millions to billions solar masses, found at galaxy centers)
    - Intermediate and primordial (theoretical)
    5. **Observable Effects**: 
    - Gravitational lensing
    - Accretion disk radiation (often X-rays)
    - Orbital perturbations of nearby stars

    Black holes challenge our understanding of physics, particularly at the intersection of general relativity and quantum mechanics.
        `,
        sources: [
        {
            name: 'NASA Black Hole Essentials',
            url: 'https://www.nasa.gov/black-holes'
        },
        {
            name: 'ESA Science - Black Holes',
            url: 'https://www.esa.int/Science_Exploration/Space_Science/Black_holes'
        },
        {
            name: 'LIGO Scientific Collaboration',
            url: 'https://www.ligo.org/science/BlackHoles.php'
        },
        {
            name: 'Event Horizon Telescope Findings',
            url: 'https://eventhorizontelescope.org/science'
        }
        ],
    },
    },
  {
    id: '2',
    type: 'default',
    position: { x: 0, y: 75 },
    data: {
      label: 'What is the basic structure of a black hole?',
      description:
        "Before diving deeper, let's understand the fundamental concepts related to this topic.",
      reasoning:
        'This step follows logically from the previous findings. By examining this aspect, we can better understand the overall concept and build a more comprehensive knowledge map.',
      details: 'A black hole is structured into several key regions. At its center lies the singularity, a point of infinite density where all mass is compressed. Surrounding the singularity is the event horizon, the "point of no return" where gravity is so strong that not even light can escape. Just outside the event horizon, some black holes have an accretion disk—a swirling ring of superheated gas and dust being pulled inward. Additionally, many black holes emit powerful jets of particles from their poles due to intense magnetic fields. The entire structure is governed by extreme gravity, warping space-time itself.',
      sources: [
        { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Black_hole' },
        {
          name: 'Britannica',
          url: 'https://www.britannica.com/science/black-hole',
        },
        {
            name: 'NASA',
            url: 'https://www.nasa.gov/black-holes',
        }
      ],
    },
    },
    {
    id: '3',
    type: 'default',
    position: { x: -100, y: 200 },
    data: {
      label: 'What happens at the singularity?',
      description: 'Exploring the most extreme region at the heart of a black hole',
      reasoning: 'Understanding the singularity is crucial as it represents the core mystery of black holes where our current physical laws break down.',
      details: 'The singularity is a point of infinite density and zero volume where all the black hole\'s mass is concentrated. According to general relativity, space-time curvature becomes infinite here, making our current physics inadequate to describe it. This is where quantum gravity theories (like string theory or loop quantum gravity) attempt to provide answers. The singularity may not be a physical point but rather a mathematical representation of our incomplete understanding.',
      sources: [
        {
          name: 'Space.com - Singularities Explained',
          url: 'https://www.space.com/black-hole-singularity'
        },
        {
          name: 'Scientific American - Beyond the Singularity',
          url: 'https://www.scientificamerican.com/article/beyond-the-black-hole-singularity/'
        }
      ]
    }
  },
  {
    id: '4',
    type: 'default',
    position: { x: 100, y: 200 },
    data: {
      label: 'How does the event horizon work?',
      description: 'Examining the boundary that defines a black hole',
      reasoning: 'The event horizon is the defining feature of black holes and understanding its properties helps explain why black holes behave the way they do.',
      details: 'The event horizon is a spherical boundary marking the point where escape velocity equals the speed of light. Key properties include: 1) Nothing inside can communicate with the outside universe, 2) Time dilation becomes infinite at the surface (to an outside observer), 3) It appears to glow with Hawking radiation due to quantum effects. The size is determined by the Schwarzschild radius (rₛ = 2GM/c²). Recent research suggests event horizons may have quantum "fuzziness" rather than being perfectly smooth.',
      sources: [
        {
          name: 'Event Horizon Telescope',
          url: 'https://eventhorizontelescope.org/science'
        },
        {
          name: 'Hawking Radiation Explained',
          url: 'https://www.quantamagazine.org/stephen-hawkings-black-hole-paradox-keeps-physicists-puzzled-20200312/'
        }
      ]
    }
  },
  {
    id: '5',
    type: 'default',
    position: { x: 100, y: 300 },
    data: {
      label: 'What is Hawking radiation and how does it relate to event horizons?',
      description: 'Exploring the quantum phenomenon that makes black holes glow',
      reasoning: 'This extends our understanding of event horizons by examining one of their most surprising behaviors predicted by quantum theory.',
      details: 'Hawking radiation is thermal radiation emitted by black holes due to quantum effects near the event horizon. The mechanism involves: 1) Quantum fluctuations create particle-antiparticle pairs near the horizon, 2) One particle falls in while the other escapes, 3) The escaping particles appear as radiation to distant observers. This causes black holes to slowly lose mass ("evaporate"), with smaller black holes evaporating faster. The temperature of the radiation is inversely proportional to the black hole\'s mass (T ∝ 1/M). This phenomenon bridges quantum mechanics and general relativity, and suggests information paradoxes that remain unresolved.',
      sources: [
        {
          name: 'Stephen Hawking\'s Original Paper',
          url: 'https://www.nature.com/articles/248030a0'
        },
        {
          name: 'PBS Space Time - Hawking Radiation',
          url: 'https://www.youtube.com/watch?v=qPKj0YnKANw'
        },
        {
          name: 'Stanford Encyclopedia - Black Hole Thermodynamics',
          url: 'https://plato.stanford.edu/entries/black-hole-thermodynamics/'
        }
      ]
    }
  }
];

const initialEdges = [
  { id: '1-2', source: '1', target: '2', animated: false },
  { id: '2-3', source: '2', target: '3', animated: false },
  { id: '2-4', source: '2', target: '4', animated: false },
  { id: '4-5', source: '4', target: '5', animated: false }
];

type NodeData = {
    label: string;
    description: string;
    reasoning: string;
    details: string;
    sources: { name: string; url: string }[];
};

type FlowNode = {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: NodeData;
};

export default function ExplorePage() {
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(initialNodes[0].data);
    const [openDrawer, setOpenDrawer] = useState(false);

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: FlowNode) => {
            setSelectedNode(node.data);
            setOpenDrawer(true);
        },
        []
    );

    function FlowWrapper() {
        const { fitView } = useReactFlow();

        useEffect(() => {
            const handleResize = () => fitView({ padding: 0.1 });
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, [fitView]);

        return null;
    }

    return (
        <div className="h-full w-full flex flex-col">

            <div className="h-11/12 w-full grid-cols-7 flex md:grid">
            <div className="col-span-3 lg:col-span-4 w-full h-full ">
                <ReactFlow
                    nodes={initialNodes}
                    edges={initialEdges}
                    onNodeClick={onNodeClick}
                    proOptions={{ hideAttribution: true }}
                    panOnDrag={true}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    panOnScroll={false}
                    nodesConnectable={false}
                    elementsSelectable={true}
                    fitView
                >
                    <Controls
                        showFitView={true}
                        showZoom={true}    
                        showInteractive={false}
                    />
                    <FlowWrapper />
                </ReactFlow>
            </div>

            {/* Desktop/Tablet: Show details panel */}
            <div className="max-w-sm lg:max-w-md col-span-4 lg:col-span-3 h-full border-l border-neutral-200 pl-6 overflow-y-scroll scrollbar-hide hidden md:block">
                {selectedNode ? (
                <>
                    <h2 className="text-xl font-medium leading-6 mb-10">{selectedNode.label}</h2>
                    <p className="mb-4">{selectedNode.description}</p>
                    <div className="px-4 py-2 border border-neutral-200 rounded-md text-sm">
                    <h3 className="font-medium">AI Reasoning</h3>
                    <p className="text-neutral-500">{selectedNode.reasoning}</p>
                    </div>
                    <div className="my-5 leading-6">{selectedNode.details}</div>
                    <div className="flex flex-wrap items-center gap-1 mt-2">
                    {selectedNode.sources.map((source: any, index: number) => (
                        <Link
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-5 border border-neutral-200 hover:bg-neutral-50 rounded-full px-2 py-1"
                        >
                        <div className="flex items-center">
                            <img
                            src={`https://www.google.com/s2/favicons?domain=${source.url}`}
                            alt={source.name}
                            className="w-4.5 h-4.5 inline-block mr-1 rounded-full"
                            />
                            <span className="text-sm text-blue-600">{source.name}</span>
                        </div>
                        <ExternalLinkIcon className="inline-block ml-1" />
                        </Link>
                    ))}
                    </div>
                    <div className="flex justify-end items-center gap-1 mt-5">
                    <button
                        disabled={selectedNode.description === initialNodes[0].data.description}
                        className={`text-sm ${selectedNode.description === initialNodes[0].data.description ? 'bg-neutral-600/50' : 'bg-neutral-800 hover:bg-neutral-600 cursor-pointer'} text-neutral-50 rounded-md px-4 py-1`}
                    >
                        Continue exploring this path
                    </button>
                    </div>
                </>
                ) : (
                <p className="text-sm text-neutral-500">Click on a node to see its details.</p>
                )}
            </div>
            </div>
            {/* Mobile: Show Drawer */}
            <div className='flex md:hidden'>
                <Drawer
                    isOpen={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                >
                {selectedNode && (
                    <div>
                    <h2 className="text-xl font-medium leading-6 mb-10">{selectedNode.label}</h2>
                    <p className="mb-4">{selectedNode.description}</p>
                    <div className="px-4 py-2 border border-neutral-200 rounded-md text-sm">
                        <h3 className="font-medium">AI Reasoning</h3>
                        <p className="text-neutral-500">{selectedNode.reasoning}</p>
                    </div>
                    <div className="my-5 leading-6">{selectedNode.details}</div>
                    <div className="flex flex-wrap items-center gap-1 mt-2">
                        {selectedNode.sources.map((source: any, index: number) => (
                        <Link
                            key={index}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-5 border border-neutral-200 hover:bg-neutral-50 rounded-full px-2 py-1"
                        >
                            <div className="flex items-center">
                            <img
                                src={`https://www.google.com/s2/favicons?domain=${source.url}`}
                                alt={source.name}
                                className="w-4.5 h-4.5 inline-block mr-1 rounded-full"
                            />
                            <span className="text-sm text-blue-600">{source.name}</span>
                            </div>
                            <ExternalLinkIcon className="inline-block ml-1" />
                        </Link>
                        ))}
                    </div>
                    <div className="flex justify-end items-center gap-1 mt-5">
                        <button
                        className={`text-sm ${false ? 'bg-neutral-600/50' : 'bg-neutral-800 hover:bg-neutral-600 cursor-pointer'} text-neutral-50 rounded-md px-4 py-1`}
                        >
                        Continue exploring this path
                        </button>
                    </div>
                    </div>
                )}
                </Drawer>
            </div>
        </div>
    )
}