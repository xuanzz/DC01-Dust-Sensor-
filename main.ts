/**
* Sharp D01 PM2.5 感測器的函數
*/

//% weight=0 color=#59c631 icon="\uf0c2" block="PM2.5"
namespace D01 {

    let init = false

    //% blockId="setSerial" block="set D01 to %pin"
    //% weight=100 blockGap=20 blockInlineInputs=true
    export function setSerial(pin: SerialPin): void {
        basic.pause(300)
        serial.redirect(
            SerialPin.USB_TX,
            pin,
            BaudRate.BaudRate9600
        )
        init = true
    }


    //% blockId="getData" block="the data of PM2.5(ug/m3)"
    //% weight=90 blockGap=20 blockInlineInputs=true   
    export function getData(): number {
        let myData = 0
        if (init) {
            let myNum = 0
            let myArr: number[] = [0, 0, 0]
            let temp: Buffer
            myNum = serial.readBuffer(1).getNumber(NumberFormat.UInt8BE, 0)
            while (myData == 0) {
                while (myNum != 165) {
                    myNum = serial.readBuffer(1).getNumber(NumberFormat.UInt8BE, 0)
                }
                temp = serial.readBuffer(3)
                for (let i = 0; i < 3; i++) {
                    myArr[i] = temp.getNumber(NumberFormat.UInt8BE, i)
                }
                if ((myArr[0]+myArr[1]+myArr[2]) == (0x7F & myArr[3])) {
                    myData = checkPM25(myArr)
                }
                else {
                    myArr = [0, 0, 0]
                }
            }
        }
        return Math.round(myData)
    }


    function checkPM25(tempArr: number[]): number {
        let o = (tempArr[0] * 128 + tempArr[1]);
        return o
    }
} 