import React from "react";

interface DividerProps {
    dotted?: boolean;
};

const Divider: React.FC<DividerProps> = ({dotted = true})  => {
    return (
        <div className="relative my-8 flex w-full items-center">
            <div className={`flex-1 border-neutral-50 ${dotted ? 'border-t-2 border-dotted' : 'border-t'} `} />
        </div>
    );
};

export default Divider;