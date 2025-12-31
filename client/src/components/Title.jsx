import React from "react";

const Title = ({
    title,
    subTitle,
    align = "center",
    font = "font-playfair",
    variant = "light"
}) => {
    const titleClass =
        variant === "dark"
            ? "text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            : "bg-gradient-to-r from-red-700 via-red-600 to-green-600 bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]";

    const subTitleClass = {
        light: "text-gray-400",
        dark: "text-gray-300",
        color: "text-black/80"
    }[variant] || "text-gray-700";


    return (
        <div
            className={`flex flex-col justify-center items-center text-center px-2 ${align === "left" && "md:items-start md:text-left"
                }`}
        >
            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold ${font} ${titleClass}`}>
                {title}
            </h1>

            {subTitle && (
                <p className={`mt-2 sm:mt-3 text-xs sm:text-sm md:text-base max-w-[42rem] ${subTitleClass}`}>
                    {subTitle}
                </p>
            )}
        </div>
    );
};

export default Title;
