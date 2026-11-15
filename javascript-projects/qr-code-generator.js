import QRCode from 'qrcode';

export function generateQRCode(canvas, content) {
    return QRCode.toCanvas(canvas, content, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 240,
    });
}
