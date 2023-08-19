import { useState,useEffect } from "react"
import { AnimatePresence,motion } from "framer-motion"
import { useSnapshot } from "valtio"

import config from "../config/config"
import state from "../store"
import {download, logoShirt, stylishShirt} from "../assets"
import { downloadCanvasToImage,reader } from "../config/helpers"
import {EditorTabs,FilterTabs,DecalTypes} from "../config/constants"
import { fadeAnimation,slideAnimation } from "../config/motion"
import { AIPicker,ColorPicker,FilePicker,Tab,CustomButton } from "../components"

const Customizer = () => {
  const snap = useSnapshot(state)
  const [file,setFile] = useState('')
  const [prompt,setPrompt] = useState('')
  const [genimage,setGenimage] = useState(false)

  const [activeEditor,setActiveEditor] = useState('')
  const [activeFilter,setActiveFilter] = useState({
    logoShirt: true,
    stylishShirt: false,
})

const generateTabContent = () => {
  switch (activeEditor) {
    case "colorpicker":
      return <ColorPicker />
    case "filepicker":
      return <FilePicker
        file={file}
        setFile={setFile}
        readFile={readFile}
      />
    case "aipicker":
      return <AIPicker 
        prompt={prompt}
        setPrompt={setPrompt}
        generatingImg={genimage}
        handleSubmit={handleSubmit}
      />
    default:
      return null;
  }
}
const handleSubmit = async (type) => {
  if(!prompt) return alert("Please enter a prompt");

  try {
    setGenimage(true);

    const response = await fetch('http://localhost:8080/api/v1/dalle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
      })
    })

    const data = await response.json();

    handleDecals(type, `data:image/png;base64,${data.photo}`)
  } catch (error) {
    alert(error)
  } finally {
    setGenimage(false);
    setActiveEditor("");
  }
}

const handleDecals=(type,result)=>{
const decalType = DecalTypes[type];
state[decalType.stateProperty] = result;


if(!activeFilter[decalType.filterTab]){
  handleactiveFilter(decalType.filterTab)
}

}

const handleactiveFilter =(tabName)=>{
  switch (tabName) {
    case "logoShirt":
        state.isLogoTexture = !activeFilter[tabName];
      break;
    case "stylishShirt":
        state.isFullTexture = !activeFilter[tabName];
      break;
    default:
      state.isLogoTexture = true;
      state.isFullTexture = false;
      break;
  }

  // after setting the state, activeFilterTab is updated

  setActiveFilter((prevState) => {
    return {
      ...prevState,
      [tabName]: !prevState[tabName]
    }
  })
}

const readFile = (type) =>{
  reader(file).then((result)=>{
    handleDecals(type,result)
    setActiveEditor("")
  })
}
  return (
    <AnimatePresence>
     {!snap.intro && (
      <>
       <motion.div key="custom" className="absolute top-0 left-0 z-10" {...slideAnimation('left')}>
        <div className="flex items-center min-h-screen">
          <div className="editortabs-container tabs">
            {EditorTabs.map((tab)=>(
              <Tab key={tab.name} tab={tab} handleClick={()=>setActiveEditor(tab.name)}/>
            ))}
          
          {generateTabContent()}
          </div>
          
        </div>

       </motion.div>
       <motion.div className="absolute z-10 top-5 right-5" {...fadeAnimation}>
        <CustomButton type="filled" title="Go Back" handleClick={()=>state.intro = true} customStyles="w-fit px-4 py-2.5 font-bold text-sm"/>
       </motion.div>
       <motion.div className="filtertabs-container" {...slideAnimation('up')}>
       {FilterTabs.map((tab)=>(
              <Tab key={tab.name} isFilterTab isActiveTab={activeFilter[tab.name]} tab={tab} handleClick={()=> handleactiveFilter(tab.name)}/>
            ))}
       </motion.div>
      </>
     )}
    </AnimatePresence>
  )
}

export default Customizer
