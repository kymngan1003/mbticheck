const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Function to calculate MBTI number from an array
function calculateMBTINumber(arr) {
    if (arr.length !== 70) {
        throw new Error('Input array should contain 70 elements.');
    }

    let mbtiType = '';
    var countArr = {};
    var countIndex = 0;

    for (let i = 0; i < 70; i++) {
        if (i % 7 == 0) {
            countIndex = 0;
        }
        if (!countArr.hasOwnProperty(countIndex)) {
            countArr[countIndex] = {a: 0, b: 0};
        }
        if (arr[i] == "A") {
            (countArr[countIndex].a)++;

        } else {
            (countArr[countIndex].b)++;
        }
        countIndex++;
    }
    // Convert the dichotomies into MBTI type

    console.log(countArr);

    console.log(mbtiType);
    mbtiType += countArr[0].a > countArr[0].b ? 'E' : 'I';
    console.log(mbtiType);
    mbtiType += (countArr[1].a + countArr[2].a) > (countArr[1].b + countArr[2].b) ? 'S' : 'N';
    console.log(mbtiType);
    mbtiType += (countArr[3].a + countArr[4].a) > (countArr[3].b + countArr[4].b) ? 'T' : 'F';
    console.log(mbtiType);
    mbtiType += (countArr[5].a + countArr[6].a) > (countArr[5].b + countArr[6].b) ? 'J' : 'P';
    console.log(mbtiType);

    // Return the numerical representation of the MBTI type
    return mbtiType === 'ENTJ' ? 0 :
        mbtiType === 'ENFJ' ? 1 :
            mbtiType === 'ESFJ' ? 2 :
                mbtiType === 'ESTJ' ? 3 :
                    mbtiType === 'ENTP' ? 4 :
                        mbtiType === 'ENFP' ? 5 :
                            mbtiType === 'ESFP' ? 6 :
                                mbtiType === 'ESTP' ? 7 :
                                    mbtiType === 'INTP' ? 8 :
                                        mbtiType === 'INFP' ? 9 :
                                            mbtiType === 'ISFP' ? 10 :
                                                mbtiType === 'ISTP' ? 11 :
                                                    mbtiType === 'INTJ' ? 12 :
                                                        mbtiType === 'INFJ' ? 13 :
                                                            mbtiType === 'ISFJ' ? 14 :
                                                                mbtiType === 'ISTJ' ? 15 : -1;
}

// API endpoint to calculate MBTI number from an array
app.post('/calculateMBTI', (req, res) => {
    const {array} = req.body;

    if (!Array.isArray(array) || array.length !== 70) {
        return res.status(400).json({error: 'Input should be an array containing 70 elements'});
    }

    try {
        const mbtiNumber = calculateMBTINumber(array);
        res.json({mbtiNumber});
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message});
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
