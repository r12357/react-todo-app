import React from "react";

type Props = {
    name: string;
    uncompletedCount: number;
};

const WelcomeMessage = (props: Props) => {
    const currentTime = new Date();
    const greeting = currentTime.getHours() < 12 ? "おはよう" : "こんにちは";

    return (
        <div className="text-blue-700">
            {greeting},{props.name}さん.現在の未完了タスクは{props.uncompletedCount}個です．
        </div>
    );
};

export default WelcomeMessage;