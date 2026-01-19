const { main } = require("../Services/ai.service");

const getYourMood = async (req, res) => {
    const { myCurrMood } = req.body;
    console.log(`my Current mood ${myCurrMood}`);

    try {

        if (myCurrMood == null || myCurrMood == "") {
            return res.json({
                status: 0,
                data: null
            });
        }

        
        const resultData = await main(myCurrMood);

        return res.json({
            status:1,
            data:resultData
        });


    } catch (e) {
        return res.json({
            status: 0,
            data: null
        });
    }
};


module.exports = { getYourMood };