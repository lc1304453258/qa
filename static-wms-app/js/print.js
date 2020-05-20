document.addEventListener( "plusready",  function()
{
    var _BARCODE = 'BluetoothPrinter',
    B = window.plus.bridge;
    var BluetoothPrinter =
    {
        PrintSync : function (Argus)
        {
            return B.execSync(_BARCODE, "PrintSync", [Argus]);
        }
    };
    window.plus.BluetoothPrinter = BluetoothPrinter;
}, true );


function printTest()
{
    var DATA =
        "{"
        +"'paperHeight':30.0,"
        +"'paperWidth':100.0,"
        +"'paperMargin' : 2,"
        +"'printItems' : ["
        +"{"
        +"'content':'测试文本',"
        +"'enabled':true,"
        +"'displayType':'文本',"
        +"'left':5.0,"
        +"'top':5.0,"
        +"'width':40.0,"
        +"'height':4.0"
        +"},"
        +"{"
        +"'content':'123456',"
        +"'enabled':true,"
        +"'displayType':'条形码',"
        +"'left':5.0,"
        +"'top':10.0,"
        +"'width':30.0,"
        +"'height':5.0"
        +"},"
        +"{"
        +"'content':'123456789012345678901236',"
        +"'enabled':false,"
        +"'displayType':'二维码',"
        +"'left':5.0,"
        +"'top':18.0,"
        +"'width':10.0,"
        +"'height':7.0"
        +"},"
        +"{"
        +"'content':'123456789012345678901233',"
        +"'displayType':'EPC',"
        +"'enabled':true,"
        +"'left':0,"
        +"'top':0,"
        +"'width':0,"
        +"'height':0"
        +"}"
        +"]"
        +"}";
    alert(DATA);
    var Argus = plus.BluetoothPrinter.PrintSync(DATA);
}