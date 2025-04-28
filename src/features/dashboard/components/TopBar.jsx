import { useState } from 'react';
import { RiSearchLine, RiNotification3Line, RiUserLine, RiRefreshLine, RiDownloadLine } from '@remixicon/react';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../../../context/AuthContext';
import { post } from '../../../lib/fetch';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';  // Add this import for better table support

const TopBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { refreshData, loading, timeUntilRefresh } = useDashboard();
  const { user } = useAuth();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const generatePDF = (report) => {
    const doc = new jsPDF();
    
    // PDF Configuration
    const config = {
      margins: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
      },
      fonts: {
        header: { size: 24, style: 'bold' },
        h1: { size: 18, style: 'bold' },
        h2: { size: 16, style: 'bold' },
        h3: { size: 14, style: 'bold' },
        normal: { size: 10, style: 'normal' }
      },
      spacing: {
        paragraph: 7,
        section: 10,
        subsection: 5
      }
    };

    // Initialize document
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - config.margins.left - config.margins.right;
    let yPos = config.margins.top;

    // Helper functions
    const checkPageBreak = (height = config.spacing.paragraph) => {
      const pageHeight = doc.internal.pageSize.getHeight();
      if (yPos + height >= pageHeight - config.margins.bottom) {
        doc.addPage();
        yPos = config.margins.top;
        return true;
      }
      return false;
    };

    const addText = (text, font = 'normal', indent = 0) => {
      doc.setFont('helvetica', config.fonts[font].style);
      doc.setFontSize(config.fonts[font].size);
      
      const lines = doc.splitTextToSize(text, usableWidth - indent);
      lines.forEach(line => {
        checkPageBreak();
        doc.text(line, config.margins.left + indent, yPos);
        yPos += config.spacing.paragraph;
      });
    };

    const addBulletPoint = (text, level = 0) => {
      const indent = level * 10;
      const bullet = level === 0 ? '•' : '○';
      checkPageBreak();
      doc.setFont('helvetica', 'normal');
      doc.text(bullet, config.margins.left + indent, yPos);
      addText(text, 'normal', indent + 7);
    };

    // Title Section
    addText('Analytics Report', 'header');
    yPos += config.spacing.section;

    // Period
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Period: ${startDate} to ${endDate}`, config.margins.left, yPos);
    yPos += config.spacing.section * 1.5;

    // Process markdown sections
    const sections = report.split('\n## ');
    sections.forEach((section, index) => {
      if (index === 0) {
        // Skip the title as we've already added it
        return;
      }

      const [sectionTitle, ...content] = section.split('\n');
      
      // Section Title
      checkPageBreak(config.spacing.section);
      addText(sectionTitle.trim(), 'h1');
      yPos += config.spacing.subsection;

      // Process content
      let inSubSection = false;
      let inList = false;

      content.forEach(line => {
        line = line.trim();
        if (!line) return;

        // Handle different line types
        if (line.startsWith('### ')) {
          // Sub-sub-section
          yPos += config.spacing.subsection;
          addText(line.replace('### ', ''), 'h3');
          yPos += config.spacing.subsection;
        } else if (line.startsWith('#### ')) {
          // Sub-sub-sub-section
          addText(line.replace('#### ', ''), 'h3');
          yPos += config.spacing.subsection;
        } else if (line.startsWith('- ')) {
          // Bullet point
          addBulletPoint(line.substring(2));
        } else if (line.startsWith('1. ')) {
          // Numbered list
          const number = line.split('.')[0];
          const text = line.substring(number.length + 2);
          addBulletPoint(`${number}. ${text}`);
        } else {
          // Regular paragraph
          if (inList) {
            yPos += config.spacing.paragraph;
            inList = false;
          }
          addText(line);
        }
      });

      yPos += config.spacing.section;
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} of ${pageCount}`,
        config.margins.left,
        doc.internal.pageSize.getHeight() - 10
      );
      doc.text(
        'Generated by Datafloww Analytics',
        pageWidth - config.margins.right,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'right' }
      );
    }

    // Save the PDF
    doc.save(`analytics-report-${startDate}-to-${endDate}.pdf`);
  };

  const handleDownloadReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select a date range');
      return;
    }

    setIsGenerating(true);
    try {
      // Get the analytics data
      const analyticsResponse = await fetch(`https://chat-api-xi9k.onrender.com/api/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          client_id: user.$id
        })
      });

      if (!analyticsResponse.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await analyticsResponse.json();
      
      // Generate PDF from the response
      generatePDF(data.report);
      
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
      setShowDatePicker(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className="flex items-center justify-between h-16">
          {/* Search Bar */}
          <div className="flex-1 flex items-center">
            <div className="w-full max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiSearchLine className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Download Report Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Download report</span>
                <RiDownloadLine className="h-6 w-6" />
              </button>
              
              {/* Date Picker Dropdown */}
              {showDatePicker && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <button
                      onClick={handleDownloadReport}
                      disabled={isGenerating}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isGenerating ? 'Generating...' : 'Download Report'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={refreshData}
              disabled={loading}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative group"
            >
              <span className="sr-only">Refresh data</span>
              <RiRefreshLine className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`} />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {loading ? 'Refreshing...' : `Next refresh in ${formatTime(timeUntilRefresh)}`}
              </div>
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
            >
              <span className="sr-only">View notifications</span>
              <RiNotification3Line className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* User Profile */}
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">View profile</span>
              <RiUserLine className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar; 