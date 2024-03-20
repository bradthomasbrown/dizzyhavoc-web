// import useEffect and useState
import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function LegalsPopup() {
        if (!IS_BROWSER) return <></>;
                // state variable to decide if we should render pop-up
    const [displayPopUp, setDisplayPopUp] = useState(false);
    const [checked, setchecked] = useState(false);
    // when pop-up is closed this function triggers, we pass it to 'onClose' property of the modal
     const closePopUp = () => {
         // setting key "seenPopUp" with value true into localStorage
         localStorage.setItem("seenPopUp", "true");
         // setting state to false to not display pop-up
         setDisplayPopUp(false);
     }
     // the useEffect to trigger on first render and check if in the localStorage we already have data about user seen and closed the pop-up
  useEffect(() => {
    // getting value of "seenPopUp" key from localStorage
    const returningUser = localStorage.getItem("seenPopUp");
    // if it's not there, for a new user, it will be null
    // if it's there it will be boolean true
    // setting the opposite to state, false for returning user, true for a new user
    setDisplayPopUp(!returningUser);
  }, []);
        return (
             <div>
                 {displayPopUp && (
                             <div 
                             className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center"
                         >
                             <div className="bg-white dark:bg-[#191919] h-auto p-6 rounded max-w-md mx-auto">
                                 <p className="text-xl text-gray-800 dark:text-[#d2d2d2] text-center">
                                     By clicking continue and using our Bridge you agree to:
                                 </p>
                                 <div className="mt-4 text-gray-800 dark:text-[#d2d2d2] text-base leading-6">
                                     <ul className="list-disc ml-8">
                                         <li>
                                             Being blessed by the DizzyHavoc team   {/* ! to change before deploy ! */}
                                         </li>
                                         <li>
                                           Blabla bla  {/* ! to change before deploy ! */}
                                         </li>
                                     </ul>
                                 </div>
                                 <div className="mt-4">
                                     <label className="inline-flex items-center">
                                         <input
                                             type="checkbox"
                                             className="form-checkbox text-gray-800 dark:text-[#d2d2d2]"
                                             checked={checked}
                                             onChange={() => setchecked(!checked)}
                                         />
                                         <span className="ml-2 text-gray-800 dark:text-[#d2d2d2]">I agree to these terms</span>
                                     </label>
                                 </div>
                                 <div className="mt-6 flex justify-end">
                                     <div
                                         style={{ opacity: checked ? 1 : 0.5, pointerEvents: checked ? 'auto' : 'none' }}
                                         className={`text-2xl mx-auto shadow-xl font-[Poppins] text-gray-800 dark:text-[#d2d2d2] rounded-lg py-1 px-4 hover:scale-[105%] border dark:border-[#3d3d3d] border-[#e9e9e9] dark:bg-[#191919] cursor-pointer bg-[#f1f1f1] ${displayPopUp ? '' : 'opacity-50 pointer-events-none'}`}
                                         onClick={() => {closePopUp()}}
                                     >
                                         Continue
                                     </div>
                                 </div>
                             </div>
                         </div>
                 )}
             </div>
         );
}
           
    