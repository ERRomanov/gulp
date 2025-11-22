import imagemin from "gulp-imagemin";

export const images = () => {
    return app.gulp.src(app.path.src.images, {encoding: false})
        .pipe(app.plugins.plumber())
        .pipe(app.plugins.newer(app.path.build.images))
        .pipe(app.plugins.if(app.isBuild, imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 3
        })))
        .pipe(app.gulp.dest(app.path.build.images))
        .pipe(app.plugins.browsersync.stream());
}