import AdminPage from '@/components/custom/AdminPage';
import { Card, CardContent } from '@/components/ui/card';

const QueryNotFound = ({ message }: { message: string; }) => {
  return (
    <div>
        <AdminPage withBackButton={true}>
            <div className="min-h-[60vh] flex items-center justify-center w-full">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center">{message}</p>
                    </CardContent>
                </Card>
            </div>
        </AdminPage>    
    </div>
  )
}

export default QueryNotFound
