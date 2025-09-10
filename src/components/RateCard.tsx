import React, { useState } from 'react'
import { Card, CardContent } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Eye, MoreHorizontal, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import PdfPreview from './custom/PdfPreview';
import { format, intlFormat } from 'date-fns';
import Modal from './custom/Modal';
import ButtonWithLoading from './custom/ButtonWithLoading';
import { PowerRate } from '@/types/PowerRate';
import { Badge } from './ui/badge';
import ImagePreview from './custom/ImagePreview';
import api from '@/api/axios';
import { toast } from '@/hooks/use-toast';

type Props = {
  refetch?: () => void;
  item: PowerRate;
  maxVisible?: number;
  noActionButton?: boolean;
}

const RateCard = ({ item, maxVisible = 4, refetch, noActionButton }: Props) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const files = item?.files;
  
  const notImageFiles = files?.filter(item => !item?.mime_type.startsWith("image/"));
  const images = files?.filter(item => item.mime_type.startsWith("image/"));

  const visibleImages = images.slice(0, maxVisible);
  const extraCount = images.length - visibleImages.length;

  const navigate = useNavigate();

  const rates = item?.rows;

  const handleSetAsActive = async (id: number) => {
    const data = {
      id: id,
    }

    try {
      const res = await api.put(`/api/monthly-rates/set-as-active`, data);
      console.log(res);
      toast({
        title: "Successfully Activated"
      })

      refetch();
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    setLoading(true);

    const data = {
      ids: [id]
    }

    try {
      const res = await api.delete(`/api/monthly-rates`, { data });
      console.log(res);
      toast({
        title: "Successfully Deleted"
      })
      refetch();
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card key={item?.id} className='w-full'>
      <CardContent className='p-4'>
          <div className='space-y-4'>
            <div className='flex items-start justify-between'>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold'>Month of {item?.month}, {item?.year}</span>
                  {item?.status === "active" && <Badge className='bg-green-500 text-white'>
                    Active
                  </Badge>}
                </div>
                <span className='text-muted-foreground text-xs'>Posted: {format(new Date(item?.created_at), 'PPp')}</span>
              </div>
              {!noActionButton && <div className='flex items-center gap-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MoreHorizontal className='size-7 cursor-pointer hover:bg-secondary hover:text-foreground rounded-full p-1' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!item?.status && <DropdownMenuItem onClick={() => handleSetAsActive(item?.id)}>Set as Active</DropdownMenuItem>}
                    <DropdownMenuItem onClick={() => navigate(`${item?.id}`)}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`${item?.id}/edit`)}>Edit</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Modal disabled={loading} title={`Delete Power Rates for ${item?.month}, ${item?.year}`} labelIsNotButton={true} buttonLabel={<X className='size-7 cursor-pointer hover:bg-secondary hover:text-foreground rounded-full p-1' />} buttonClassName="w-10 h-10 bg-destructive text-white hover:bg-destructive/50" open={deleteModal} setOpen={setDeleteModal}>
                  <p>Are you sure you want to delete?</p>
                  <div className="w-full grid grid-cols-2 gap-2">
                    <ButtonWithLoading className="w-full" loading={loading} disabled={loading} onClick={() => handleDelete(item.id)}>
                      Yes
                    </ButtonWithLoading>
                    <Button variant="outline" onClick={() => setDeleteModal(false)}>
                      Cancel
                    </Button>
                  </div>
                </Modal>
              </div>}
            </div>
            
            {rates?.length > 0 && noActionButton && <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-2'>
                {rates?.map((item) => {
                  const municipalities = JSON.parse(item.municipalities);
                  return (
                    <div key={item.id} className='grid md:grid-cols-5 gap-2 items-center border p-4 rounded-lg text-sm'>
                      <div>
                        <span className='text-muted-foreground'>Municipalities</span>
                        {municipalities?.map((m, index) => {
                          return (
                            <div key={index}>
                              <span>{m}</span>
                            </div>
                          )
                        })}
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-muted-foreground'>Residential</span>
                        <span>₱{item.residential}</span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-muted-foreground'>Commercial</span>
                        <span>₱{item.commercial}</span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-muted-foreground'>Public Building</span>
                        <span>₱{item.public_building}</span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-muted-foreground'>Streetlight</span>
                        <span>₱{item.streetlight}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>}
            <div>
              {!noActionButton ? <div className='grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {images?.length > 0 && visibleImages?.map((image, index) => {
                  return (
                    <div key={image.id}>
                      <ImagePreview key={image.id} rate_id={item.id} image={image} isLast={index === visibleImages.length - 1 && extraCount > 0} extraCount={extraCount} />
                    </div>
                  )
                })}
              </div>
              :
              <div className='flex flex-col gap-4'>
                {images?.length > 0 && images.map((image) => {
                  return (
                    <ImagePreview key={image.id} image={image} isMaxHeight={true} />
                  )
                })}
              </div>}
              {notImageFiles?.length > 0 && <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className='font-normal text-sm'>Show Attached Files</AccordionTrigger>
                  <AccordionContent className='flex flex-col gap-2'>
                    {notImageFiles?.map((item) => {
                      return (
                        <PdfPreview key={item.id} file={item} />
                      )
                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>}
            </div>
          </div>
      </CardContent>
    </Card>
  )
}

export default RateCard
