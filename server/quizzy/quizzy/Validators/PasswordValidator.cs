using System;
using System.Text.RegularExpressions;

public class PasswordValidator
{
    public static bool IsValidPassword(string password)
    {
        if (string.IsNullOrEmpty(password))
            return false;

        Regex regex = new Regex(@"^(?=.*[0-9])(?=.*[A-Z])(?!.*\s).{8,}$");
        if (!regex.IsMatch(password))
            return false;
        return true;
    }
}