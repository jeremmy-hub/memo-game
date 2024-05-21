/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {v4 as uuid} from 'uuid';
const url = 'https://api.giphy.com/v1/stickers/random?api_key=FFEChJmynaVGREDvL6ZFV3S8M16JPcO9&tag=&rating=g';

const SetLevel = (level) => {
    let NUMBER_OF_PICTURES = 0;
    switch (level) {
        case 'easy':
            NUMBER_OF_PICTURES = 10;
            break;
        case 'medium':
            NUMBER_OF_PICTURES = 20;
            break;
        case 'hard':
            NUMBER_OF_PICTURES = 30;
            break;
        case 'amatuer':
            NUMBER_OF_PICTURES = 40;
            break;
        default:
            NUMBER_OF_PICTURES = 10;    
    }
    return NUMBER_OF_PICTURES;
  } //sets the level of difficulty;
  
  
async function getUrl (url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.data.images.original.url?data.data.images.original:getUrl(url);
} 

export default function  Main () {
    const [IMAGES, set_IMAGES] = useState([]);

    const [SCORES, set_SCORE] = useState(0);
    const [BEST_SCORES, set_BEST_SCORE] = useState(0);
    const [CLICKED, set_CLICKED] = useState([]);

    function increment_score () {
        set_SCORE((previous_score)=>previous_score + 1); 
        return SCORES>=BEST_SCORES && set_BEST_SCORE((previous)=>previous+1);
    }
    
    
    function reset_score () {set_SCORE(0)}
    

    useEffect(() => {}, []);
    
    function handleClick (referrence) {
        if(!CLICKED.includes(referrence)){
            set_CLICKED([...CLICKED, referrence]);
            increment_score();
            return;
        }
        reset_score()
    }


    const ScoreBoard = ({className}) => {
        return (
            <div className={`container-fluid-md score-board ${className}`}>
               
                <div className={`d-flex flex-row`}>
                    <div role='navigation' className="log"> Game logo.example
                    </div>
                    
                    <div role='navigation' className="bg-secondary p-2">
                        <form action="/" method="post">
                            <label htmlFor="game-level">LEVEL: </label>
                            <select name="level" id="game-level">
                                <option value="easy">easy</option>
                                <option value="medium">medium</option>
                                <option value="hard">hard</option>
                                <option value="amatuer">amatuer</option>
                            </select>
                        </form>
                    </div>
                    
                    <div className="scores bg-secondary d-flex align-items-center justify-content-center p-2">
                        <div role='navigation' className="bg-light text-center">
                            <span className="m-1 p-1 text-info">current Score:</span> 
                            <br />{SCORES}</div>
                    

                        <div role='navigation' className="bg-light text-center">
                            <span className="m-1 p-1 text-info">High Score:</span> 
                            <br />{BEST_SCORES}</div>
                    </div>    
                </div>
            </div>

        )

    }


    const Display = ({className}) => {
        return (
            <div className={`${className}`}>
                {IMAGES.map((image)=>{
                    return (
                            <div className="card m-1" 
                                    style={{width:"clamp(100px, 20vw, 500px)", height:'clamp(100px, 20vw, 500px)', marginInline: '10px', position:'reletive'}} 
                                    key={image.id} 
                                    onClick={()=>{handleClick(image.id)}} 
                                    onTouchCancel={()=>{handleClick(image.id)}}>

                                <img src={image.url} 
                                    className="card-img-top" 
                                    alt='...' 
                                    style={{width:"100%", height:'100%', marginInline: '1vw'}}/>
                            
                            </div>
                            )
                })}
            </div>
        )
    }

    return (
        <div className="bg-success">
            <ScoreBoard className='scores'/>
            <Display className='display bg-secondary p4 d-flex flex-wrap align-content-center justify-content-center'/>
        </div>
    )




    
}
//steps
//game name (memory tester puzzle);
//1: fetch 10/20/30/40 images based on level of difficulty set on game start;
//2: store the images as an object with a unique id {url: '....', id: '....'}; 