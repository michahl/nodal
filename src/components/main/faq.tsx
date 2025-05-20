'use client';

import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

const faqs = [
  {
    question: "What does this tool do?",
    answer: "It turns your factual questions into interactive visual maps, breaking down key concepts, their relationships, and supporting sources.",
  },
  {
    question: "How is this different from a regular chatbot or search engine?",
    answer: "Instead of giving just a text answer, this tool shows how ideas connect. You can explore topics visually and dive deeper into related questions.",
  },
  {
    question: "What kind of questions work best?",
    answer: "Questions rooted in science, history, or factual topics — like “What causes climate change?” or “How do black holes form?” — work best. The system checks if your input is valid before generating a graph.",
  },
  {
    question: "Where does the information come from?",
    answer: "It uses Sonar, Perplexity's powerful retrieval-augmented generation model, to generate accurate, well-sourced answers. Each node in the graph includes citations from trusted sources you can verify.",
  },
  {
    question: "Do I need to sign up to use it?",
    answer: "Yes — an account is required to use the tool, save your question maps, and revisit your explorations.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleFAQ = (
    index: number
  ) => {
    setOpenIndex(index === openIndex ? -1 : index);
  };

  return (
    <div className="max-w-2xl mt-4 mx-auto space-y-2">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border-b border-neutral-200 py-2 transition-all duration-300"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full text-left flex justify-between items-center text-lg font-medium cursor-pointer"
          >
            <span>{faq.question}</span>
            <span className="transform transition-transform duration-300">
              {
                openIndex === index
                  ? <ChevronDownIcon className="w-3 h-3" />
                  : <ChevronRightIcon className="w-3 h-3" />
              }
            </span>
          </button>
          <div
            className={`mt-2 overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="mt-2">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
