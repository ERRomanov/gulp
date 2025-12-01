import fs from "fs";
import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";

export const otfToTtf = () => {
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {encoding: false})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            }))
        )
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}
export const ttfToWoff = () => {
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {encoding: false})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            }))
        )
        .pipe(fonter({
            formats: ['woff']
        }))
        .pipe(app.plugins.rename(function (path) {
            path.dirname = "";
            return path;
        }))
        .pipe(app.gulp.dest(`${app.path.build.fonts}`))
        .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {encoding: false}))
        .pipe(ttf2woff2())
        .pipe(app.plugins.rename(function (path) {
            path.dirname = "";
            return path;
        }))
        .pipe(app.gulp.dest(`${app.path.build.fonts}`));
}
export const fontsStyle = () => {
    let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
    
    fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
        if (err) {
            console.error("Ошибка чтения папки fonts:", err);
            return;
        }

        if (!fontsFiles || fontsFiles.length === 0) {
            console.log("Нет файлов шрифтов для обработки");
            return;
        }

        if (fs.existsSync(fontsFile)) {
            fs.unlinkSync(fontsFile);
            console.log("Удален старый fonts.scss");
        }

        let createdCount = 0;
        
        fontsFiles.forEach(fontFile => {
            if (!fontFile.endsWith('.woff2')) return;
            
            let fontName = fontFile.replace('.woff2', '');
            let fontFamily = extractCleanFontName(fontName);
            let isItalic = fontName.toLowerCase().includes('italic');
            
            // Для переменных шрифтов создаем одно правило с диапазоном
            let fontFace = `@font-face {\n\tfont-family: "${fontFamily}";\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontName}.woff2") format("woff2");\n\tfont-weight: 100 900;\n\tfont-stretch: 75% 125%;\n\tfont-style: ${isItalic ? 'italic' : 'normal'};\n}\n\n`;
            
            fs.appendFileSync(fontsFile, fontFace);
            createdCount++;
        });
    });

    return app.gulp.src(`${app.path.srcFolder}`);
}

function extractCleanFontName(fileName) {
    // Убираем все модификаторы
    let cleanName = fileName
        .replace(/[-_](variable|var|vf|wght|italic|oblique|regular|normal)/gi, '')
        .replace(/[-_]+/g, ' ')
        .trim();
    
    // Капитализируем
    cleanName = cleanName.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    return cleanName || 'CustomFont';
}
