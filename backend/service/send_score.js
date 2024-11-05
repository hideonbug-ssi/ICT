import {emit} from "../common/express";

const sendScore = () => {
    // Query database
    const result = [
        {
            id: 1,
            name: "Team AAA",
            score: 100,
        }
    ]

    emit(result)
}