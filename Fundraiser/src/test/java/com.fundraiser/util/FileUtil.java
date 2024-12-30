package com.fundraiser.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;

public class FileUtil {

    /**
     * Reads the content of a file as a single string.
     *
     * @param filePath The path to the file.
     * @return The content of the file as a string.
     * @throws IOException If an I/O error occurs.
     */
    public static String readFileAsString(String filePath) throws IOException {
        return Files.readString(Path.of(filePath));
    }

    /**
     * Reads the content of a file line by line into a list of strings.
     *
     * @param filePath The path to the file.
     * @return A list of strings, where each string is a line in the file.
     * @throws IOException If an I/O error occurs.
     */
    public static List<String> readFileAsLines(String filePath) throws IOException {
        return Files.readAllLines(Path.of(filePath));
    }

    /**
     * Writes the specified content to a file. Overwrites the file if it exists.
     *
     * @param filePath The path to the file.
     * @param content The content to write to the file.
     * @throws IOException If an I/O error occurs.
     */
    public static void writeFile(String filePath, String content) throws IOException {
        Files.writeString(Path.of(filePath), content, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
    }

    /**
     * Appends the specified content to a file.
     *
     * @param filePath The path to the file.
     * @param content The content to append to the file.
     * @throws IOException If an I/O error occurs.
     */
    public static void appendToFile(String filePath, String content) throws IOException {
        Files.writeString(Path.of(filePath), content, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
    }
}
