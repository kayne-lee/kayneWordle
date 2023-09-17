import { useState } from "react"

const useWordle = (solution) => {

    const [turn, setTurn] = useState(0) //number of guesses max 6
    const [currentGuess, setCurrentGuess] = useState('') //what the user is typing
    const [guesses, setGuesses] = useState([...Array(6)]) //each guess
    const [history, setHistory] = useState([]) //each previous guess 
    const [isCorrect, setIsCorrect] = useState(false) //checks if user is right
    const [usedKeys, setUsedKeys] = useState({}) //color keys based on previous guesses

    //format guess into array as an object including letter and color
    const formatGuess = () => {
        let solutionArray = [...solution]
        let formattedGuess = [...currentGuess].map((l) => {
            return {key: l, color: 'grey'}
        })

        //find correct letters
        formattedGuess.forEach((l, i) => {
            if (solutionArray[i] === l.key) {
                formattedGuess[i].color = 'green'
                solutionArray[i] = null
            }
        })

        //find yellow letters
        formattedGuess.forEach((l, i) => {
            if (solutionArray.includes(l.key) && l.color !== 'green') {
                formattedGuess[i].color = 'yellow'
                solutionArray[solutionArray.indexOf(l.key)] = null
            }
        })

        return formattedGuess
    }

    const addNewGuess = (formattedGuess) => {
        if (currentGuess === solution) {
            setIsCorrect(true)
        }

        setGuesses((prevGuesses) => {
            let newGuesses = [...prevGuesses]
            newGuesses[turn] = formattedGuess
            return newGuesses
        })

        setHistory((prevHistory) => {
            return [...prevHistory, currentGuess]
        })

        setTurn((prevTurn) => {
            return prevTurn + 1
        })
        setUsedKeys(prevUsedKeys => {
            formattedGuess.forEach(l => {
              const currentColor = prevUsedKeys[l.key]
      
              if (l.color === 'green') {
                prevUsedKeys[l.key] = 'green'
                return
              }
              if (l.color === 'yellow' && currentColor !== 'green') {
                prevUsedKeys[l.key] = 'yellow'
                return
              }
              if (l.color === 'grey' && currentColor !== ('green' || 'yellow')) {
                prevUsedKeys[l.key] = 'grey'
                return
              }
            })
      
            return prevUsedKeys
          })
        setCurrentGuess('')
    }

    const handleKeyup = ({ key }) => {
        //allowing user to submit a word
        if (key === 'Enter') {
            //check if user has remanining guesses
            if (turn > 5) {
                console.log('Out of guesses bud')
                return
            }
            //check if user already attempted that word
            if (history.includes(currentGuess)) {
                console.log('Already tried that word bud')
                return
            }
            //check if word is 5 letters
            if (currentGuess.length !== 5) {
                console.log('Word must be 5 letters bud')
                return
            }
            const formatted = formatGuess()
            addNewGuess(formatted)
        }
        if (key === 'Backspace') {
            setCurrentGuess((prev) => {
                return prev.slice(0, -1)
            })
            return
        }

        if (/^[A-Za-z]$/.test(key)) {
            if (currentGuess.length < 5) {
                setCurrentGuess((prev) => {
                    return prev + key
                })
            }
        }

    }

    return {turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyup}
}

export default useWordle