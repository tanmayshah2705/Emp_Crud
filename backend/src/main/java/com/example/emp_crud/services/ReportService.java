package com.example.emp_crud.services;

import com.example.emp_crud.models.*;
import com.example.emp_crud.repositories.*;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private InternRepository internRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private StateRepository stateRepository;

    public ByteArrayInputStream generateEmployeeReport() {
        List<Employee> employees = employeeRepository.findAll();
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Paragraph para = new Paragraph("Employee Report", font);
            para.setAlignment(Element.ALIGN_CENTER);
            document.add(para);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{3, 5, 4, 4, 2, 3});

            String[] headers = {"ID", "Name", "DOB", "City", "Sex", "Salary"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell);
            }

            for (Employee emp : employees) {
                table.addCell(emp.getEmpId());
                table.addCell(emp.getName());
                table.addCell(emp.getDateOfBirth().toString());
                table.addCell(emp.getCity().getName());
                table.addCell(emp.getGender());
                table.addCell(emp.getSalary().toString());
            }

            document.add(table);
            document.close();

        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream generateInternReport() {
        List<Intern> interns = internRepository.findAll();
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Paragraph para = new Paragraph("Intern Report", font);
            para.setAlignment(Element.ALIGN_CENTER);
            document.add(para);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{3, 5, 4, 3, 4, 4, 3});

            String[] headers = {"ID", "Name", "Email", "Gender", "City", "Dept", "Stipend"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell);
            }

            for (Intern intern : interns) {
                table.addCell(new PdfPCell(new Phrase(intern.getId().toString(), FontFactory.getFont(FontFactory.HELVETICA, 10))));
                table.addCell(new PdfPCell(new Phrase(intern.getName(), FontFactory.getFont(FontFactory.HELVETICA, 10))));
                table.addCell(new PdfPCell(new Phrase(intern.getEmail(), FontFactory.getFont(FontFactory.HELVETICA, 10))));
                table.addCell(new PdfPCell(new Phrase(intern.getGender() != null ? intern.getGender() : "", FontFactory.getFont(FontFactory.HELVETICA, 10))));
                table.addCell(new PdfPCell(new Phrase(intern.getCity() != null ? intern.getCity().getName() : "", FontFactory.getFont(FontFactory.HELVETICA, 10))));
                table.addCell(new PdfPCell(new Phrase(intern.getDepartment() != null ? intern.getDepartment() : "", FontFactory.getFont(FontFactory.HELVETICA, 10))));
                table.addCell(new PdfPCell(new Phrase(intern.getStipend() != null ? intern.getStipend().toString() : "0.0", FontFactory.getFont(FontFactory.HELVETICA, 10))));
            }

            document.add(table);
            document.close();

        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream generateDepartmentReport() {
        List<Department> departments = departmentRepository.findAll();
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Paragraph para = new Paragraph("Department Report", font);
            para.setAlignment(Element.ALIGN_CENTER);
            document.add(para);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{3, 7});

            String[] headers = {"Dept Code", "Name"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell);
            }

            for (Department dept : departments) {
                table.addCell(dept.getDeptCode().toString());
                table.addCell(dept.getName());
            }

            document.add(table);
            document.close();

        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream generateCityReport() {
        List<City> cities = cityRepository.findAll();
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Paragraph para = new Paragraph("City Report", font);
            para.setAlignment(Element.ALIGN_CENTER);
            document.add(para);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{2, 5, 5});

            String[] headers = {"City Code", "Name", "State"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell);
            }

            for (City city : cities) {
                table.addCell(city.getCode().toString());
                table.addCell(city.getName());
                table.addCell(city.getState() != null ? city.getState().getName() : "");
            }

            document.add(table);
            document.close();

        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream generateStateReport() {
        List<State> states = stateRepository.findAll();
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Paragraph para = new Paragraph("State Report", font);
            para.setAlignment(Element.ALIGN_CENTER);
            document.add(para);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{3, 7});

            String[] headers = {"State Code", "Name"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell);
            }

            for (State state : states) {
                table.addCell(state.getCode().toString());
                table.addCell(state.getName());
            }

            document.add(table);
            document.close();

        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
