import webp from "gulp-webp";

export const webpConvert = () => {
    return app.gulp.src(app.path.src.images, {encoding: false})
        .pipe(app.plugins.plumber())
        .pipe(webp())
        .pipe(app.gulp.dest(app.path.build.images))
        .pipe(app.plugins.browsersync.stream());
}