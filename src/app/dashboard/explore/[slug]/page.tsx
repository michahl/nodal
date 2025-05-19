"use client";

import React, { useState, useCallback } from 'react';
import { Controls, MiniMap, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Link from 'next/link';
import { ExternalLinkIcon } from '@radix-ui/react-icons';

const initialNodes = [
  {
    id: '1',
    type: 'default',
    position: { x: 50, y: 20 },
    data: {
      label: 'What is a black hole?',
      description: '',
      reasoning: '',
      details: '',
      sources: [],
    },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 50, y: 100 },
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
]

const initialEdges = [
  { id: '1-2', source: '1', target: '2', animated: false },
]

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
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: FlowNode) => {
            setSelectedNode(node.data);
        },
        []
    );
    
    return (
        <div className='h-full w-full flex flex-col'>
            <div>
                <h1 className="text-xl font-medium">What is a black hole?</h1>

            </div>
            <div className='h-10/12 w-full grid-cols-7 grid'>
                <div className='col-span-4 h-full border-r border-neutral-200'>
                    <ReactFlow
                        nodes={initialNodes}
                        edges={initialEdges}
                        onNodeClick={onNodeClick}
                        proOptions={{ hideAttribution: true }}
                        panOnDrag={false}
                        zoomOnScroll={false}
                        zoomOnPinch={false}
                        panOnScroll={false}
                        nodesDraggable={true} 
                        nodesConnectable={false} 
                        elementsSelectable={true}
                        fitView
                    >
                        <Controls />
                    </ReactFlow>
                </div>

                <div className='col-span-3 h-full pl-6 overflow-y-scroll scrollbar-hide'>
                    {
                        selectedNode ? (
                            <>
                                <h2 className='text-xl font-medium leading-6 mb-10'>{selectedNode.label}</h2>
                                <p className='mb-4'>
                                    {selectedNode.description}
                                </p>

                                <div className='px-4 py-2 border border-neutral-200 rounded-md text-sm'>
                                    <h3 className='font-medium'>AI Reasoning</h3>
                                    <p className='text-neutral-500'>
                                        {selectedNode.reasoning}
                                    </p>
                                </div>

                                <div className='my-5 leading-6'>
                                    {selectedNode.details}
                                </div>

                                <div className='flex flex-wrap  items-center gap-1 mt-2'>
                                    {selectedNode.sources.map((source: any, index: number) => (
                                        <Link 
                                            key={index}
                                            href={source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='flex items-center justify-between gap-5 border border-neutral-200 hover:bg-neutral-50 rounded-full px-2 py-1'

                                        >
                                            <div className='flex items-center'>
                                                <img
                                                    src={`https://www.google.com/s2/favicons?domain=${source.url}`}
                                                    alt={source.name}
                                                    className='w-4.5 h-4.5 inline-block mr-1 rounded-full'
                                                />
                                                <span className='text-sm text-blue-600'>{source.name}</span>
                                            </div>
                                            <ExternalLinkIcon className='inline-block ml-1' />
                                        </Link>
                                    ))}
                                </div>

                                <div className='flex justify-end items-center gap-1 mt-5'>
                                    <button 
                                        className={`text-sm ${false ? 'bg-neutral-600/50' : 'bg-neutral-800 hover:bg-neutral-600 cursor-pointer'} text-neutral-50 rounded-md px-4 py-1`}
                                    >
                                        Continue exploring this path
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className='text-sm text-neutral-500'>
                                    Click on a node to see its details.
                                </p>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}