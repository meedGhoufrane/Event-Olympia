import { useEffect, useRef, useState } from 'react';
import { Modal, Button, Group, Center, Loader, Text } from '@mantine/core';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import logo from '../assets/logo.png'; // Make sure you have a logo in your assets folder

interface Ticket {
    _id: string;
    price: number;
    status: string;
    event: {
        _id: string;
        name: string;
        date: string;
        location: string;
        image?: string;
    };
    user: {
        _id: string;
        firstName?: string;
        lastName?: string;
        email: string;
    };
}

interface TicketPDFProps {
    ticket: Ticket;
    onClose: () => void;
}

export function TicketPDF({ ticket, onClose }: TicketPDFProps) {
    const [loading, setLoading] = useState(true);
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        async function generateQRCode() {
            try {
                // Creating a data object with ticket info to encode in QR
                const ticketData = {
                    ticketId: ticket._id,
                    eventId: ticket.event._id,
                    eventName: ticket.event.name,
                    userId: ticket.user._id,
                    userEmail: ticket.user.email,
                    validationCode: `TKT-${ticket._id.substring(0, 8)}`
                };

                // Convert object to JSON string for QR code
                const dataString = JSON.stringify(ticketData);

                // Generate QR code as data URL
                const qrCodeDataUrl = await QRCode.toDataURL(dataString, {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    }
                });

                setQrDataUrl(qrCodeDataUrl);
                generatePDF(qrCodeDataUrl, ticketData.validationCode);
            } catch (err) {
                console.error('Error generating QR code:', err);
                setError('Failed to generate ticket QR code. Please try again.');
                setLoading(false);
            }
        }

        generateQRCode();
    }, [ticket]);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'TBA';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const generatePDF = (qrCodeUrl: string, validationCode: string) => {
        try {
            // Create new PDF document with custom size (similar to a standard ticket)
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [100, 150] // Custom size for ticket
            });

            // Set background color for the entire page
            doc.setFillColor(250, 250, 252); // Very light gray
            doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

            // Add decorative header with gradient
            const gradient = doc.context.createLinearGradient(0, 0, doc.internal.pageSize.width, 0);
            gradient.addColorStop(0, '#4f46e5'); // Indigo
            gradient.addColorStop(1, '#2563eb'); // Blue
            doc.setFillColor(gradient);
            doc.rect(0, 0, doc.internal.pageSize.width, 15, 'F');

            // Add ticket title in the header
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('EVENT ENTRY TICKET', doc.internal.pageSize.width / 2, 10, { align: 'center' });

            // Add logo (if available)
            if (logo) {
                doc.addImage(logo, 'PNG', doc.internal.pageSize.width - 25, 2, 20, 10);
            }

            // Add event name with styling
            doc.setTextColor(30, 41, 59); // Dark slate
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(ticket.event.name, doc.internal.pageSize.width / 2, 25, {
                align: 'center',
                maxWidth: doc.internal.pageSize.width - 20
            });

            // Add decorative divider
            doc.setDrawColor(226, 232, 240); // Light slate
            doc.setLineWidth(0.5);
            doc.line(10, 30, doc.internal.pageSize.width - 10, 30);

            // Create two-column layout
            const leftCol = 15;
            const rightCol = doc.internal.pageSize.width / 2 + 5;
            let y = 35;
            const lineHeight = 7;

            // Left column - Event details
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('DATE:', leftCol, y);
            doc.setFont('helvetica', 'normal');
            doc.text(formatDate(ticket.event.date), leftCol + 15, y);
            y += lineHeight;

            doc.setFont('helvetica', 'bold');
            doc.text('LOCATION:', leftCol, y);
            doc.setFont('helvetica', 'normal');
            doc.text(ticket.event.location || 'TBA', leftCol + 15, y);
            y += lineHeight;

            doc.setFont('helvetica', 'bold');
            doc.text('TICKET TYPE:', leftCol, y);
            doc.setFont('helvetica', 'normal');
            doc.text(`General Admission ($${ticket.price.toFixed(2)})`, leftCol + 15, y);
            y += lineHeight;

            doc.setFont('helvetica', 'bold');
            doc.text('ATTENDEE:', leftCol, y);
            doc.setFont('helvetica', 'normal');
            const attendeeName = `${ticket.user.firstName || ''} ${ticket.user.lastName || ''}`.trim() || ticket.user.email;
            doc.text(attendeeName, leftCol + 15, y);
            y += lineHeight * 2;

            const qrSize = 50;
            const qrX = rightCol + 5;
            const qrY = 35;

            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6, 2, 2, 'FD');

            doc.addImage(qrCodeUrl, 'PNG', qrX, qrY, qrSize, qrSize);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(59, 130, 246);
            doc.text(`CODE: ${validationCode}`, rightCol + qrSize / 2 + 5, qrY + qrSize + 5, { align: 'center' });

            doc.setDrawColor(200, 200, 200);
            doc.setLineDashPattern([3, 3], 0);
            doc.line(10, 100, doc.internal.pageSize.width - 10, 100);
            doc.setLineDashPattern([], 0);

            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text('Keep this ticket stub for entry', doc.internal.pageSize.width / 2, 110, { align: 'center' });

            doc.setFontSize(6);
            doc.text('This ticket is non-transferable and valid only for the specified event.',
                10, doc.internal.pageSize.height - 10, { maxWidth: doc.internal.pageSize.width - 20 });
            doc.text(`Ticket ID: ${ticket._id}`, 10, doc.internal.pageSize.height - 5);

            doc.setDrawColor(59, 130, 246, 20);
            doc.setLineWidth(0.5);
            doc.roundedRect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10, 3, 3, 'S');

            doc.save(`ticket-${ticket.event.name.replace(/\s+/g, '-')}-${validationCode}.pdf`);
            setLoading(false);

        } catch (err) {
            console.error('Error generating PDF:', err);
            setError('Failed to generate ticket PDF. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Modal
            opened={true}
            onClose={onClose}
            title="Your Ticket"
            centered
            size="md"
        >
            {loading ? (
                <Center py={30}>
                    <div style={{ textAlign: 'center' }}>
                        <Loader size="lg" mb={15} />
                        <Text>Generating your ticket...</Text>
                    </div>
                </Center>
            ) : error ? (
                <div>
                    <Text color="red" mb={15}>{error}</Text>
                    <Button fullWidth onClick={onClose}>Close</Button>
                </div>
            ) : (
                <div>
                    <Text mb={15} ta="center">Your ticket has been successfully generated and downloaded!</Text>
                    <Text size="sm" c="dimmed" mb={20} ta="center">
                        If the download didn't start automatically, you can click the button below.
                    </Text>

                    {qrDataUrl && (
                        <Center mb={20}>
                            <div style={{ textAlign: 'center' }}>
                                <img src={qrDataUrl} alt="Ticket QR Code" style={{ width: 150, height: 150 }} />
                                <Text size="sm" mt={5}>Ticket Code: TKT-{ticket._id.substring(0, 8)}</Text>
                            </div>
                        </Center>
                    )}

                    <Group position="center">
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (qrDataUrl) {
                                    generatePDF(qrDataUrl, `TKT-${ticket._id.substring(0, 8)}`);
                                }
                            }}
                        >
                            Download Again
                        </Button>
                        <Button onClick={onClose}>Close</Button>
                    </Group>
                </div>
            )}
        </Modal>
    );
} 