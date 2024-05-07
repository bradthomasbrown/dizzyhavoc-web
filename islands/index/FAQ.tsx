import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

function FAQItem({ question, answer }) {
  const [exp, setexp] = useState(false);
  return (
    <>
      <div className="flex flex-col vignets">
        <div
          class="sm:text-2xl text-xl tfont-[Poppins] relative unselectable dark:text-[#d2d2d2] text-[#3d3d3d] px-3 my-1 text-center rounded-md bg-blur3 sm:w-full w-screen cursor-pointer hover:scale-[100.5%] active:scale-[99.5%]"
          onClick={() => setexp(!exp)}
        >
        {question}
        {exp ? <a class="text-lg ml-1 font-[Poppins] absolute right-1">-</a> : <a class="text-lg ml-1 font-[Poppins] absolute right-1">+</a>}
        </div>
        {exp && (
          <p class="text-md font-[Poppins] sm:w-full w-screen unselectable dark:text-[#d2d2d2] text-[#3d3d3d]">
            {answer}
          </p>
        )}
      </div>
    </>
  );
}

export function FAQ() {
  if (!IS_BROWSER) return null;
  const [hidden, sethidden] = useState(false);
  const [read, setread] = useState(false);
  const faqItems = [
    {
      question: "What is DizzyHavoc?",
      answer:
        "DizzyHavoc is a new deployment method for smart contracts, specifically designed to reduce costs and enhance flexibility.",
    },
    {
      question: "What makes DizzyHavoc unique?",
      answer: "The utilization of the EVM bytecode language instead of Solidity. This implies a more low-level and hardware-specific form of programming, closely tied to the architecture of CPUs.",
    },
    {
        question: "What makes DizzyHavoc unique?",
        answer: "The utilization of the EVM bytecode language instead of Solidity. This implies a more low-level and hardware-specific form of programming, closely tied to the architecture of CPUs.",
      },
      {
        question: "What makes DizzyHavoc unique?",
        answer: "The utilization of the EVM bytecode language instead of Solidity. This implies a more low-level and hardware-specific form of programming, closely tied to the architecture of CPUs.",
      },
      {
        question: "What makes DizzyHavoc unique?",
        answer: "The utilization of the EVM bytecode language instead of Solidity. This implies a more low-level and hardware-specific form of programming, closely tied to the architecture of CPUs.",
      },
      {
        question: "What makes DizzyHavoc unique?",
        answer: "The utilization of the EVM bytecode language instead of Solidity. This implies a more low-level and hardware-specific form of programming, closely tied to the architecture of CPUs.",
      },
  ];
  const handleClick = () => {
    sethidden(!hidden);
    setread(true);
  };
  return (
    <div class="flex w-full items-end flex-col sm:flex-row gap-x-4">
      <div
        onClick={() => handleClick()}
        className={`
          ${hidden || read ? "" : "shimmer3"}
          text-xl
          sm:text-3xl 
          mb-2 
          font-medium 
          font-[Poppins] 
          text-center 
          unselectable 
          w-full 
          sm:h-[38px]
          h-[30px]
          cursor-pointer 
          hover:scale-[100.5%] 
          active:scale-[99.5%] 
          border-[1px]
          border-e-transparent 
          border-s-transparent 
          border-t-[#5e5e5e4d] 
          border-b-[#5e5e5e4d] 
          dark:border-e-transparent 
          dark:border-s-transparent 
          dark:border-t-[#dbdbdb3b]
          dark:border-b-[#dbdbdb3b]
        dark:text-[#cccccc] 
        text-[#3d3d3d]`}
      >
        Frequently Asked Questions
      </div>
      <div class="w-screen sm:w-[710px] h-[200px] sm:h-[220px] grid items-end overflow-y-scroll overflow-x-hidden noscroll">
        {hidden &&
          faqItems.map((item) => (
            <FAQItem question={item.question} answer={item.answer} />
          ))}
      </div>
    </div>
  );
}
