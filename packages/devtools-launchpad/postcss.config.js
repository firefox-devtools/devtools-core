module.exports = {
  plugins: [
    require("postcss-bidirection"),
    require("autoprefixer"),
    require("postcss-class-namespace")()
  ]
};
