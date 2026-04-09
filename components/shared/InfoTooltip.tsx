import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export const InfoTooltip = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Info className="w-4 h-4 hover:text-slate-300 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent side="left" className="p-4 max-w-sm grid bg-slate-800 text-slate-300">
                {children}
            </TooltipContent>
        </Tooltip>
    );
}