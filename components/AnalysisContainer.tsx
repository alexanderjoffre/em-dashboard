import { LayoutDashboard, Table } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dashboard } from "./Dashboard";
import { ActionItems } from "./ActionItems";

export const AnalysisContainer = () => {
    return (
        <Tabs defaultValue="action-items" className="w-full">
            <TabsList variant="line">
                <TabsTrigger value="dashboard">
                    <LayoutDashboard />
                    Dashboard
                </TabsTrigger>
                <TabsTrigger value="action-items">
                    <Table />
                    Action Items
                </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
                <Dashboard />
            </TabsContent>
            <TabsContent value="action-items">
                <ActionItems />
            </TabsContent>
        </Tabs>
    );
}   