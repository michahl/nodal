"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Controls, ReactFlow, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Link from 'next/link';
import { CheckIcon, Cross2Icon, ExternalLinkIcon } from '@radix-ui/react-icons';
import Drawer from '@/components/ui/drawer';
import type { Node as FlowNode } from '@xyflow/react';
import { toast } from '../ui/sonar';
import DeleteNodeButton from './delete';

type NodeData = {
  label?: string;
  [key: string]: any;
};

type ExplorationData = {
  id: string;
  title: string;
  description: string;
  nodes: string;
  edges: string; 
  user_id: string;
  created_at: string;
  slug: string;
};

export default function ExploreClient({ initialData }: { initialData: ExplorationData }) {
  // Parse nodes and edges from JSON strings
  const [initialNodes, setInitialNodes] = useState(JSON.parse(initialData.nodes || '[]'));
  const [initialEdges, setInitialEdges] = useState(JSON.parse(initialData.edges || '[]'));
  const [expandingNodeId, setExpandingNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const isInitialRender = useRef(true);
  
  useEffect(() => {
    if (isInitialRender.current && initialNodes.length > 0) {
      setSelectedNode(initialNodes[0].data);
      isInitialRender.current = false;
    }
  }, [initialNodes]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: FlowNode) => {
      setSelectedNode({
        ...node.data,
        id: node.id // Include the node ID
      });
      setOpenDrawer(true);
    },
    []
  );

  const handleExpandNode = useCallback(
    async (nodeId: string, nodeContent: any) => {
      if (!nodeId || !nodeContent) return;

      setExpandingNodeId(nodeId);
      setOpenDrawer(false);

      try {
        const response = await fetch("/api/question/expand", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parentNodeId: nodeId,
            parentNodeContent: nodeContent,
            explorationSlug: initialData.slug
          }),
        })

        const data = await response.json();

        if (data.error) {
          toast.error("", {
            description: data.error,
            duration: 5000,
            dismissible: false,
            icon: <Cross2Icon className="text-red-500 w-4 h-4" />,
          });
          return;
        }

        setInitialNodes((prevNodes: any[]) => [...prevNodes, data.newNode]);
        setInitialEdges((prevEdges: any[]) => [...prevEdges, data.newEdge]);

        toast.success("", {
          description: "New insight added to your exploration",
          duration: 5000,
          dismissible: false,
          icon: <CheckIcon className="text-green-500 w-4 h-4" />,
        })

        setExpandingNodeId(null);

      } catch (e) {
        toast.error("", {
          description: "Failed to expand node",
          duration: 5000,
          dismissible: false,
          icon: <Cross2Icon className="text-red-500 w-4 h-4" />,
        });
      }
  }, [initialData.slug]);

  const handleNodeDeleted = useCallback((deletedNodes: string[], deletedEdges: string[]) => {
    setInitialNodes((prevNodes: any[]) => 
      prevNodes.filter((node) => !deletedNodes.includes(node.id))
    );
    
    setInitialEdges((prevEdges: any[]) => 
      prevEdges.filter((edge) => !deletedEdges.includes(edge.id))
    );

    if (selectedNode && deletedNodes.includes(selectedNode.id)) {
      setOpenDrawer(false);
      setSelectedNode(null);
    }
  }, [selectedNode]);
  
  return (
    <div className="h-full w-full flex flex-col">
      <div className="h-11/12 w-full grid-cols-7 flex md:grid">
        {/* ReactFlow section */}
        <div className="col-span-3 lg:col-span-4 w-full h-full">
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
        <div className="max-w-md col-span-4 lg:col-span-3 h-full border-l border-neutral-200 pl-6 overflow-y-scroll scrollbar-hide hidden md:block">
                {selectedNode ? (
                <>
                    <h2 className="text-xl font-medium leading-6">{selectedNode.label}</h2>
                    <p className="mb-4 mt-5">{selectedNode.description}</p>
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
                    {
                      !(initialNodes[0].data.description === selectedNode.description) && (
                        <div className="flex justify-between items-center gap-1 mt-5">
                          <DeleteNodeButton
                            nodeId={selectedNode.id}
                            explorationSlug={initialData.slug}
                            isRootNode={selectedNode.id === initialNodes[0]?.id}
                            onDeleteSuccess={handleNodeDeleted}
                            className="mr-2"
                          />
                          <button
                            onClick={() => handleExpandNode(selectedNode.id, selectedNode)}
                            className={`text-sm ${
                              initialNodes[0].data.description === selectedNode.description 
                                ? 'bg-neutral-600/50' 
                                : expandingNodeId === selectedNode.id
                                  ? 'bg-neutral-700 cursor-wait'
                                  : 'bg-neutral-800 hover:bg-neutral-600 cursor-pointer'
                            } text-neutral-50 rounded-md px-4 py-1 flex items-center justify-center`}
                          >
                            {expandingNodeId === selectedNode.id ? (
                              <>
                                <div className="animate-spin w-3.5 h-3.5 border-2 border-neutral-300 border-t-transparent rounded-full mr-2"></div>
                                Generating...
                              </>
                            ) : (
                              "Continue exploring this path"
                            )}
                          </button>
                        </div>
                      )
                    }
                
                </>
                ) : (
                <p className="text-sm text-neutral-500">Click on a node to see its details.</p>
                )}
            </div>
            {/* Mobile: Show Drawer */}
            <div className='flex md:hidden'>
                <Drawer
                    isOpen={selectedNode !== null && openDrawer}
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
                    {
                      !(initialNodes[0].data.description === selectedNode.description) && (
                        <div className="flex justify-between items-center gap-1 mt-5">
                          <DeleteNodeButton
                            nodeId={selectedNode.id}
                            explorationSlug={initialData.slug}
                            isRootNode={selectedNode.id === initialNodes[0]?.id}
                            onDeleteSuccess={handleNodeDeleted}
                            className="mr-2"
                          />
                          <button
                            onClick={() => handleExpandNode(selectedNode.id, selectedNode)}
                            className={`text-sm ${
                              initialNodes[0].data.description === selectedNode.description 
                                ? 'bg-neutral-600/50' 
                                : expandingNodeId === selectedNode.id
                                  ? 'bg-neutral-700 cursor-wait'
                                  : 'bg-neutral-800 hover:bg-neutral-600 cursor-pointer'
                            } text-neutral-50 rounded-md px-4 py-1 flex items-center justify-center`}
                          >
                            {expandingNodeId === selectedNode.id ? (
                              <>
                                <div className="animate-spin w-3.5 h-3.5 border-2 border-neutral-300 border-t-transparent rounded-full mr-2"></div>
                                Generating...
                              </>
                            ) : (
                              "Continue exploring this path"
                            )}
                          </button>
                        </div>
                      )
                    }
                    </div>
                )}
                </Drawer>
            </div>
      </div>
    </div>
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
}