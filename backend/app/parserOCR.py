import re
import requests


def get_invoice_number(lines):
    invoice_number = ''
    for line in lines:
        if 'faktúra' in line.lower():
            words = line.split()
            for word in words:
                if word.isdigit():
                    invoice_number = word
                    break
            if invoice_number:
                break
    return invoice_number


def get_variable_symbol(lines):
    var_symbol = ''
    for line in lines:
        if 'variabilný' in line.lower():
            words = line.split()
            for word in words:
                if word.isdigit():
                    var_symbol = word
                    break
            if var_symbol:
                break
    return var_symbol


def get_date_of_issue(lines):
    date_of_issue = ''
    date_pattern = re.compile(r"\d{2}\.\d{2}\.\d{4}")
    for line in lines:
        if 'dátum' in line.lower() and 'vystavenia' in line.lower():
            words = line.split()
            for word in words:
                if date_pattern.match(word):
                    date_of_issue = word
                    break
            if date_of_issue:
                break
    return date_of_issue


def get_due_date(lines):
    due_date = ''
    date_pattern = re.compile(r"\d{2}\.\d{2}\.\d{4}")
    for line in lines:
        if 'dátum' in line.lower() and 'splatnosti' in line.lower():
            words = line.split()
            for word in words:
                if date_pattern.match(word):
                    due_date = word
                    break
            if due_date:
                break
    return due_date


def get_delivery_date(lines):
    delivery_date = ''
    date_pattern = re.compile(r"\d{2}\.\d{2}\.\d{4}")
    for line in lines:
        if 'dátum' in line.lower() and 'dodania' in line.lower():
            words = line.split()
            for word in words:
                if date_pattern.match(word):
                    delivery_date = word
                    break
            if delivery_date:
                break
    return delivery_date


def get_payment_method(lines):
    payment_method = ''
    for line in lines:
        if 'forma' in line.lower() and 'úhrady' in line.lower():
            words = line.split()
            for i, word in enumerate(words):
                if word.lower() == 'úhrady:':
                    payment_method = words[i + 1]
                    break
            if payment_method:
                break
    return payment_method


def get_total_price(lines):
    total_price = ''
    pattern = re.compile(r"\b\d+(?:[,\s]\d+)*\b")
    for line in lines:
        if 'celkom' in line.lower() or 'spolu' in line.lower() or 'suma' in line.lower():
            words = line.split()
            for word in words:
                if pattern.match(word):
                    total_price = word
                    break
            if total_price:
                break
    return total_price


def get_bank(lines):
    bank = ''
    for line in lines:
        if 'banka' in line.lower():
            words = line.split()
            for i, word in enumerate(words):
                if word.lower() == 'banka:':
                    bank = words[i + 1]
                    break
            if bank:
                break
    return bank


def get_swift(lines):
    swift = ''
    for line in lines:
        if 'swift' in line.lower():
            words = line.split()
            for i, word in enumerate(words):
                if word.lower() == 'swift:':
                    swift = words[i + 1]
                    break
            if swift:
                break
    return swift


def get_iban(lines):
    iban = ''
    for line in lines:
        if 'iban' in line.lower():
            words = line.split()
            for i, word in enumerate(words):
                if word.lower() == 'iban:':
                    iban = words[i + 1]
                    break
            if iban:
                break
    return iban


def get_buyer_ico(lines):
    ico = ''
    for i, line in enumerate(lines):
        if 'ičo' in line.lower() and 'odberateľ' in line.lower():
            words = line.split()
            for j, word in enumerate(words):
                if word.lower() == 'ičo:':
                    ico = words[j + 1]
                    del words[j + 1]
                    del words[j]
                    lines[i] = ' '.join(words)
                    break
            if ico:
                break
    return ico


def get_supplier_ico(lines):
    ico = ''
    for i, line in enumerate(lines):
        if 'ičo' in line.lower() or '1čo' in line.lower() or '1ičo' in line.lower():
            words = line.split()
            for j, word in enumerate(words):
                if word.lower() == 'ičo:' or word.lower() == '1čo:' or word.lower() == '1ičo:':
                    ico = words[j + 1]
                    del words[j + 1]
                    del words[j]
                    lines[i] = ' '.join(words)
                    break
            if ico:
                break
    return ico


def parse_text(text):
    lines = text.split('\n')

    supplier_ico = get_supplier_ico(lines)
    details_url = f"http://localhost:5000/get_details?ico={supplier_ico}"
    supplier_details = requests.post(details_url)

    if supplier_details.status_code == 200:
        supplier_data = supplier_details.json()['data']
    else:
        supplier_data = {}

    buyer_ico = get_buyer_ico(lines)
    details_url = f"http://localhost:5000/get_details?ico={buyer_ico}"
    buyer_details = requests.post(details_url)

    if buyer_details.status_code == 200:
        buyer_data = buyer_details.json()['data']
    else:
        buyer_data = {}

    data = {
        'invoice_number': get_invoice_number(lines),
        'var_symbol': get_variable_symbol(lines),
        'date_of_issue': get_date_of_issue(lines),
        'due_date': get_due_date(lines),
        'delivery_date': get_delivery_date(lines),
        'payment_method': get_payment_method(lines),
        'total_price': get_total_price(lines),
        'bank': get_bank(lines),
        'swift': get_swift(lines),
        'iban': get_iban(lines),
        'buyer_ico': buyer_ico,
        'supplier_ico': supplier_ico,
        'supplier_data': supplier_data,
        'buyer_data': buyer_data
    }
    return data
