const HeroButton = (props)=>{
    return(
        <>

        <button className={`my-component ${props.disabled ? 'herobutton disable' : 'herobutton'}`} type="button" onClick={props.onClick} disabled={props.disabled}>
            <span>{props.text}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
        </button>
        </>
    );;
}
export default HeroButton;